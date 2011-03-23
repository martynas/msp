/**
 * Portfolio
 */
var Portfolio = Class.create({
	
	initialize : function(mainapp) {
		this.mainapp = mainapp;
		this.stocks = new Array();
		this.series = new Array();
		
		this.sPortfolioValue = new ChartSeries(); /* Portfolio value change */
		this.addSeries(this.sPortfolioValue);
		
		this.sTrendLine = new ChartSeries(); /* Portfolio trend line */
		this.addSeries(this.sTrendLine);
		
		this.graphics = new PortfolioGraphics(this);
	},
	
	dispose : function() {
		
	},
	
	addStockByTicker : function(ticker) {
		this.stocks.push(new Stock(this, ticker));
	},
	
	removeStock : function(stock) {
		this.stocks.remove(stock);
		this.onChanged();
	},
	
	stockUpdate : function(stock) {
		this.onChanged();
	},
	
	onChanged : function() {
		this.calculate();
		this.updateGraphics();
	},
	
	getTimeScale : function() {
		return this.mainapp.getTimeScale();
	},
	
	addSeries : function(series) {
		this.series.push(series);
		this.mainapp.stockChart.addSeries(series);
		this.updateGraphics();
	},
	
	/* Calculates various attributes of the portfolio */
	calculate : function() {
		var ts = this.getTimeScale();
		
		var t = new Array(); // finding time when first quote is available for each and every stock
		for(var j = 0; j < this.stocks.length; j++)
			t.push((this.stocks[j].amount == 0)? 0 : ts.x.length-1);
		
		var pvalue = new Array(); /*portfolio value within time */
		for(var i = 0; i < ts.x.length; i++) {
			var v = 0;
			for(var j = 0; j < this.stocks.length; j++) {
				var s = this.stocks[j];
				if (s.quotes.length > i && s.quotes[i] > 0) {
					v += s.quotes[i] * s.amount;
					t[j] = Math.min(t[j], i);
				}
			}
			pvalue.push(v);
		}
		ts.timeStart = t.length > 0? t.max() : 0;
		this.sPortfolioValue.setSeries(pvalue);
		
		if (ts.currentTime < ts.timeStart || ts.currentTime > ts.todayIndex) {
			// currentTime is out of bounds and requires recalculation
			var today = new Date();
			ts.currentTime = ts.dateIndex(new Date(today.getFullYear()-1, today.getMonth(), today.getDay(), 
					0, 0, 0, 0));
		}
			
		// Analyzing only time between timeStart and currentTime
		var pvalue1 = pvalue.slice(ts.timeStart, ts.currentTime);
		var x1 = ts.xNumber.slice(ts.timeStart, ts.currentTime);
		var stat = new Statistics(x1, pvalue1);
		
		var trendLine = new Array();
		for (var i = 0; i < ts.x.length; i++) {
			var tl = 0; // Trend Line
			if (i < ts.startTime) {
			} else if (i < ts.timeEnd) {
				tl = stat.trendLineValue(ts.xNumber[i]);
			}
			trendLine.push(tl);
		}
		
		this.sTrendLine.setSeries(trendLine);
	},
	
	updateGraphics : function() {
		this.mainapp.portfolioUpdate(this);
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
