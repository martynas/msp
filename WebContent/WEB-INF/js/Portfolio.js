/**
 * Portfolio
 */
var Portfolio = Class.create({
	
	initialize : function(mainapp) {
		this.mainapp = mainapp;
		this.stocks = new Array();
		this.series = new Array();
		this.stat = null;
		
		this.sPortfolioValue = new LinearChartSeries(); /* Portfolio value change */
		this.addSeries(this.sPortfolioValue);
		
		this.sTrendLine = new LinearChartSeries(); /* Portfolio trend line */
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
	
	calcGlobalParams : function() {
		var ts = this.getTimeScale();
		
		ts.timeStart = 0;
		
		// Index of a day when quotes available for all stocks
		for (var i = 0; i < this.stocks.length; i++)
			ts.timeStart = Math.max(ts.timeStart, this.stocks[i].firstDateI);
		
		if (ts.currentTime < ts.timeStart || ts.currentTime > ts.todayIndex) {
			// currentTime is out of bounds and requires recalculation
			var today = new Date();
			ts.currentTime = ts.dateIndex(new Date(today.getFullYear()-1, today.getMonth(), today.getDay(), 
					0, 0, 0, 0));
		}
		
		// Collecting variables
		var vars = new Array();
		for (var i = 0; i < this.stocks.length; i++) {
			var s = this.stocks[i];
			vars.push(s.quotes.slice(ts.timeStart, ts.timeEnd));
		};
		this.varsM = $M(vars);

		// Building Statistics object
		var x1 = ts.xNumber.slice(ts.timeStart, ts.currentTime + 1);
		this.stat = new Statistics(x1, this.varsM.minor(1, 1, this.varsM.rows(), ts.currentTime - ts.timeStart + 1));
		this.stat.calculateStatistics();
		
		// Updating PSD Chart Data
		var psdX = new Array(), psdY = new Array(), p = this.stat.portfolios;
		for (var i = 0; i < p.length; i++) {
			// Also transforming month data into Yearly
			psdX.push(p[i].s * Math.sqrt(12));
			psdY.push(p[i].mean * 12);
		}
		
		var psdDots = new Array(), vars = this.stat.vars;
		for (var i = 0; i < vars.length; i++)
			psdDots.push({x : vars[i].s * Math.sqrt(12), y : vars[i].mean * 12, label : this.stocks[i].ticker});
		
		this.mainapp.psdChart.setXValues(psdX);
		this.mainapp.sPSDValue.setSeries(psdY);
		this.mainapp.sPSDDots.setExtendedSeries(psdDots);
	},
	
	updateQuotesChart : function() {
		var ts = this.getTimeScale();
		
		// Collecting weights
		var weights = new Array();
		for (var i = 0; i < this.stocks.length; i++)
			weights.push(this.stocks[i].amount);
		this.stat.calculateProduct(weights, 1);
		
		// Updating Quotes Chart data
		var x1 = ts.xNumber.slice(ts.timeStart, ts.timeEnd);
		this.mainapp.stockChart.setXValues(x1);
		// Total Portfolio value
		var pValue = $M(weights).transpose().x(this.varsM).elements[0];
		this.sPortfolioValue.setSeries(pValue);
			
		// Trendline
		var trendLine = new Array();
		for (var i = ts.timeStart; i < ts.timeEnd; i++) {
			trendLine.push(this.stat.trendLineValue(ts.xNumber[i]));
		}
		this.sTrendLine.setSeries(trendLine);
	},
	
	/* Calculates various attributes of the portfolio */
	calculate : function() {
		this.calcGlobalParams();
		this.updateQuotesChart();
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
