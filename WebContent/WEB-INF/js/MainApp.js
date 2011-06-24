var ColorManager = Class.create({
	
	initialize : function() {
		this.i = 0;
		this.colors  = ['red', 'blue', 'green'];
	},
	
	getColor : function() {
		var c = this.colors[this.i];
		this.i = (this.i + 1) % this.colors.length;
		return c;
	}
	
});
var cm = new ColorManager();

/**
 * Main Application
 */
var MainApp = Class.create({
	
	initialize : function() {
		this.portfolios = new Array();
		this.ts = new TimeScale();
		
		this.phPortfolios = $(s_phPortfoliosPath); // Place holder for list of stocks
		this.stockChart = new QuotesChart('stockChart', this);
		this.createPortfolio();
		
		// Constructing PSD Chart
		this.psdChart = new PSDChart('psdChart', this);
		this.sPSDValue = new LinearChartSeries();
		this.psdChart.addSeries(this.sPSDValue);
		
		this.sPSDDots = new DotChartSeries();
		this.psdChart.addSeries(this.sPSDDots);
	},
	
	createPortfolio : function() {
		var p = new Portfolio(this);
		this.portfolios.push(p);
		return p;
	},
	
	getDefaultPortfolio : function() {
		return this.portfolios[0];
	},
	
	getTimeScale : function() {
		return this.ts;
	},
	
	portfolioUpdate : function(portfolio) {
		this.stockChart.draw();
		if (this.psdChart)
			this.psdChart.draw();
	},
	
	/* Reports error to a user 
	 * source - source DOM object. Error message will be shown next to it
	 * message - error message to be displayed
	 * */
	reportError : function (source, message) {
		
	}

});

/* Class for maintaining Global Time Scale (X axis) */
var TimeScale = Class.create({
	
	initialize : function() {
		this.x = new Array();
		this.xNumber = new Array();
		this.todayIndex = 0;
		
		var today = new Date();
		var toYear = today.getFullYear() + 10;
		for(year = 1990; year <= toYear; year++) {
			var toMonth = (year == toYear? today.getMonth() : 12);
			for(month = 0; month < toMonth; month++) {
				var v = new Date(year, month, 1, 0, 0, 0, 0);
				this.x.push(v);
				this.xNumber.push(v.getTime());
				
				if (today.getFullYear() == year && today.getMonth == month)
					this.todayIndex = this.x.length;
			}
		}
		
		this.timeStart = 0; // Time since when we have quotes for all positions. Index of this.x
		this.timeEnd = Math.round(this.x.length * 0.8);
		this.currentTime = Math.round(this.x.length * 0.4); // Imaginary Current date which can be in the past also
	},
	
	dateIndex : function(date) { // Currently very approximate function
		return Math.round((date.getTime() - this.xNumber[0]) / (30.4 * 1000 * 60 * 60 * 24));
	},
	
	todayIndex : function() {
		return this.todayIndex;
	},
	
	/* Converts Historical Qoutes from JSON to global Time Scale */
	json2ts : function(qoutes) {
		var iTS = 0;
		var iQ = 0;
		var result = new Array();
		while (iTS < this.x.length && iQ < qoutes.length) {
			var diff = qoutes[iQ].Date - this.x[iTS];
			
			if (diff < 0) {
				iQ++;
			} else if (diff <= 7 * 1000 * 60 * 60 * 24)  {
				/* In case first day of month is not a working day. E.g. New Year. */
				result.push(qoutes[iQ].AdjClose);
				iTS++; iQ++;
			} else {
				iTS++;
				result.push(null);
			};
		}
		
		return result;
	}
	
});

var mainapp;

var id = 0;
function uid() {
	return id++;
};