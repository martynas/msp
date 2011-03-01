/**
 * Constants
 */
const url_hsq = 'stocks/shq';

// Selectors for Global Elements
const s_elPortfolios = "elPortfolios";
const s_phPortfoliosPath = 'phPortfolios';

// Selectors for Portfolio element
const s_ptPortfolio = '#prototypes .portfolio';

//Selectors for Stock element
const s_ptStock = '#prototypes .stock';

/**
 * Stock Data and Business Logic
 */
var Stock = Class.create({

	initialize : function(portfolio, ticker) {
		this.portfolio = portfolio;
		this.ticker = ticker;
		this.show = true;
		this.graphics = new StockGraphics(this);
		this.series = new Array();
		
		this.getQoutes();
	},
	
	dispose : function() {
		
	},

	getQoutes : function() {
		this.graphics.setBusy(true);

		(new Ajax.Request(url_hsq, {
			method : 'get',
			parameters : {t: this.ticker},
			sender : this,
			onComplete : function(httpResponse) { 
					httpResponse.request.options.sender.setQoutes(httpResponse); 
			}
		})).r = this;
	},

	setQoutes : function(httpResponse) {
		var r = httpResponse.responseText;
		r = r.replace(/"Date\(('[\d-]+')\)"/g, "Date.parse($1)");
		this.qoutes = eval(r);
		this.qoutes.sort(function(a, b) {
			return a.Date - b.Date;
		});
		
		var y1 = this.qoutes[0].AdjClose;
		var s = new Array;
		this.qoutes.each(function(item){
			s.push({x : item.Date, y : (item.AdjClose-y1)/y1});
		});
		this.addSeries(new ChartSeries(s));

		this.graphics.updateView();
		this.graphics.setBusy(false);
	},
	
	setShow : function(show) {
		this.show = show;
	},
	
	addSeries : function(series) {
		this.series.push(series);
		this.portfolio.mainapp.stockChart.addSeries(series);
	}
	
});

/**
 * Graphical interface handler
 */
var StockGraphics = Class.create({

	initialize : function(stock) {
		this.stock = stock;
		this.busy = 0;
		
		this.initializeGraphics();
		this.updateView();
	},
	
	dispose : function() {
		
	},
	
	initializeGraphics : function() {
		this.graphics = $$(s_ptStock)[0].cloneNode(true);
		this.stock.portfolio.graphics.phStocks.appendChild(this.graphics);
		
		this.gBusyImg = this.graphics.select('.busy')[0];
		this.gTicker = this.graphics.select('.ticker')[0];
		
		this.gShow = this.graphics.select('.show')[0];
		this.gShow.obj = this;
	},
	
	updateView : function() {
		this.gShow.checked = this.stock.show;
		this.gTicker.textContent = this.stock.ticker;
	},

	setBusy : function(busy) {
		busy ? this.busy++ : this.busy--;
		if (this.busy > 0) {
			this.gBusyImg.style.display = 'inline';
		} else {
			this.gBusyImg.style.display = 'none';
		}
	},
	
	eventOnShowClick : function() {
		this.stock.setShow(this.gShow.checked);
	}

});

/**
 * Portfolio
 */
var Portfolio = Class.create({
	
	initialize : function(mainapp) {
		this.mainapp = mainapp;
		this.stocks = new Array();
		this.graphics = new PortfolioGraphics(this);
	},
	
	dispose : function() {
		
	},
	
	addStockByTicker : function(ticker) {
		this.stocks.push(new Stock(this, ticker));
	}

});

/**
 * Portfolio Graphics
 */
var PortfolioGraphics = Class.create({
	
	initialize : function(portfolio) {
		this.portfolio = portfolio;
		this.initializeGraphics();
	},
	
	dispose : function() {
		
	},
	
	// This method initializes graphics of the Portfolio
	initializeGraphics : function() {
		this.graphics = $$(s_ptPortfolio)[0].cloneNode(true);
		this.portfolio.mainapp.phPortfolios.appendChild(this.graphics);
		
		this.phStocks = this.graphics;
	}
	
});

/**
 * DataSeries
 */
var ChartSeries = Class.create({
	
	initialize : function(array) {
		this.id = uid();
		this.color = cm.getColor();
		
		this.setSeries(array);
	},

	setSeries : function(array) {
		this.series = array;
		var self = this;
		array.each(function(item) {
			if (isNaN(self.minx)) {
				self.minx = self.maxx = item.x;
				self.miny = self.maxy = item.y;
			} else {
				self.minx = Math.min(self.minx, item.x);
				self.maxx = Math.max(self.maxx, item.x);
				self.miny = Math.min(self.miny, item.y);
				self.maxy = Math.max(self.maxy, item.y);
			};
		});
	}

});

/**
 * General chart
 */
var GeneralChart = Class.create({
	
	initialize : function(canvasId) {
		this.canvas = $(canvasId);
		this.series = new Hash();
	},
	
	dispose : function() {
		
	},
	
	draw : function() {
		this.recalcCoordinates();
		this.canvas.width = this.canvas.width; // clear the canvas
	},
	
	addSeries : function(chartSeries) {
		this.series.set(chartSeries.id, chartSeries);
		
		this.draw();
	},
	
	removeSeries : function(chartSeries) {
		this.series.unset(chartSeries.id);
		
		this.draw();
	},
	
	recalcCoordinates : function() {
		this.minx = NaN;
		var self = this;
		this.series.each(function(item) {
			var i = item.value;
			if (isNaN(self.minx)) {
				self.minx = i.minx;
				self.maxx = i.maxx;
				self.miny = i.miny;
				self.maxy = i.maxy;
			} else {
				self.minx = Math.min(self.minx, i.minx);
				self.maxx = Math.max(self.maxx, i.maxx);
				self.miny = Math.min(self.miny, i.miny);
				self.maxy = Math.max(self.maxy, i.maxy);
			};
		});
	},
	
	xOnCanvas : function(x) {
		return Math.round((x - this.minx)/(this.maxx - this.minx) * this.canvas.width)+0.5;
	},
	
	yOnCanvas : function(y) {
		return Math.round(this.canvas.height - (y - this.miny)/(this.maxy - this.miny) * this.canvas.height)+0.5;
	}
	
});

var LinearChart = Class.create(GeneralChart, {
	
	draw : function($super) {
		$super();
		
		var self = this;
		var canvas = this.canvas.getContext('2d');
		this.series.each(function(item) {
			var i = item.value;
			
			canvas.strokeStyle = i.color;
			canvas.lineWidth = 1;
			canvas.beginPath();
			
			var x = self.xOnCanvas(i.series[0].x);
			var y = self.yOnCanvas(i.series[0].y);
			i.series.each(function(s) {
				x = self.xOnCanvas(s.x);
				y = self.yOnCanvas(s.y);
				canvas.lineTo(x, y);
			});
			canvas.stroke();
		});
	}
	
});

var ColorManager = Class.create({
	
	initialize : function() {
		this.i = 0;
		this.colors  = ['red', 'blue', 'green'];
	},
	
	getColor : function() {
		var c = this.colors[this.i];
		this.i = (this.i+1)%this.colors.length;
		return c;
	}
	
});
var cm = new ColorManager();

/**
 * Main Application
 */
var MainApp = Class.create({
	
	initialize : function() {
		this.phPortfolios = $(s_phPortfoliosPath); // Place holder for list of stocks
		this.stockChart = new LinearChart(stockChart);
		
		this.portfolios = new Array();
		
		this.createPortfolio();
	},
	
	createPortfolio : function() {
		var p = new Portfolio(this);
		this.portfolios.push(p);
		return p;
	},
	
	getDefaultPortfolio : function() {
		return this.portfolios[0];
	}

});

var mainapp;

var id = 0;
function uid() {
	return id++;
};