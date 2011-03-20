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
		this.portfolios = new Array();
		this.ts = new TimeScale();
		
		this.phPortfolios = $(s_phPortfoliosPath); // Place holder for list of stocks
		this.stockChart = new LinearChart(stockChart, this);
		
		this.createPortfolio();
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
		
		var today = new Date();
		for(year = 1995; year <= today.getFullYear(); year++) {
			var toMonth = (year == today.getFullYear()? today.getMonth() : 12);
			for(month = 0; month < toMonth; month++)
				this.x.push(new Date(year, month, 1, 0, 0, 0, 0));
		}
		
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