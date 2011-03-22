/**
 * Stock Data and Business Logic
 */
var Stock = Class.create({

	initialize : function(portfolio, ticker) {
		this.portfolio = portfolio;
		this.ticker = ticker;
		this.show = false;
		this.quotes = new Array();
		this.amount = 100; /* Number of stocks in portfolio */
		
		this.graphics = new StockGraphics(this);
		
		this.getQuotes();
	},
	
	dispose : function() {
		this.graphics.dispose();
		this.portfolio.removeStock(this);
	},

	getQuotes : function() {
		this.graphics.setBusy(true);

		(new Ajax.Request(url_hsq, {
			method : 'get',
			parameters : {t: this.ticker},
			sender : this,
			onComplete : function(httpResponse) { 
					httpResponse.request.options.sender.setQuotes(httpResponse); 
			}
		})).r = this;
	},

	setQuotes : function(httpResponse) {
		if (httpResponse.status == responseOK) {
			var r = httpResponse.responseText;
			r = r.replace(/"Date\(('[\d-]+')\)"/g, "Date.parse($1)");
			this.fullinfo = eval(r);
			this.fullinfo.sort(function(a, b) {
				return a.Date - b.Date;
			});
			
			this.quotes = this.portfolio.getTimeScale().json2ts(this.fullinfo);
			this.onChanged();
			this.graphics.setBusy(false);
		} else {
			this.portfolio.mainapp.reportError(null, null); /* TODO: report error: no such quote */
			this.dispose();
		};
		
	},
	
	setShow : function(show) {
		this.show = show;
	},
	
	addSeries : function(series) {
		this.series.push(series);
		this.portfolio.mainapp.stockChart.addSeries(series);
	},
	
	onChanged : function() {
		this.graphics.updateView();
		this.portfolio.stockUpdate(this);
	},
	
	setAmount : function(amount) {
		this.amount = amount;
		this.onChanged();
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
		this.graphics.parentNode.removeChild(this.graphics);
	},
	
	initializeGraphics : function() {
		this.graphics = $$(s_ptStock)[0].cloneNode(true);
		this.stock.portfolio.graphics.phStocks.appendChild(this.graphics);
		
		this.gBusyImg = this.graphics.select('.busy')[0];
		this.gTicker = this.graphics.select('.ticker')[0];
		
		this.gShow = this.graphics.select('.show')[0];
		this.gShow.obj = this;
		
		this.gAmount = this.graphics.select('[name="amount"]')[0];
		this.gAmount.obj = this;
		
		this.gDelete = this.graphics.select('[name="delete"]')[0];
		this.gDelete.obj = this;
	},
	
	updateView : function() {
		this.gShow.checked = this.stock.show;
		this.gTicker.textContent = this.stock.ticker;
		this.gAmount.textContent = this.stock.amount;
	},

	setBusy : function(busy) {
		busy ? this.busy++ : this.busy--;
		if (this.busy > 0) {
			this.gBusyImg.style.display = 'inline';
		} else {
			this.gBusyImg.style.display = 'none';
		}
	},
	
	eventOnShowClick : function(checkbox) {
		this.stock.setShow(this.gShow.checked);
	},
	
	onInputValueChange : function(input) {
		var value = input.value;
		if (isFinite(value)) /* Validating input */
			this.stock.setAmount(value);
	},
	
	onInputKeyUp : function(input) {
		this.onInputValueChange(input);
	},
	
	onButtonClick : function(button) {
		if (button == this.gDelete) {
			this.stock.dispose();
		}
	}

});
