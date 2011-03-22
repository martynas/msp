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
		
		var t = new Array(); // finding time when first quote is available for each stock
		for(j = 0; j < this.stocks.length; j++)
			t.push((this.stocks[j].amount == 0)? 0 : ts.x.length-1);
		
		var pvalue = new Array(); /* change of total portfolio value */
		for(i = 0; i < ts.x.length; i++) {
			var v = 0;
			for(j = 0; j < this.stocks.length; j++) {
				var s = this.stocks[j];
				if (s.quotes.length > i && s.quotes[i] > 0) {
					v += s.quotes[i] * s.amount;
					t[j] = Math.min(t[j], i);
				}
			}
			pvalue.push(v);
		}
		ts.timeStart = t.max();
		
		this.sPortfolioValue.setSeries(pvalue);
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
