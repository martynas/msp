function onLoad() {
	mainapp = new MainApp();
	
	testInit();
}

function testInit() {
	mainapp.getDefaultPortfolio().addStockByTicker('MMM');
}


/* events */
function onCheckboxClick(cb) {
	cb.obj.eventOnShowClick(cb);
}

function onInputValueChange(inp) {
	inp.obj.onInputValueChange(inp);
}

function onInputKeyUp(inp) {
	inp.obj.onInputKeyUp(inp);
}

function onButtonClick(btn) {
	btn.obj.onButtonClick(btn);
}

function addStockByTicker() {
	mainapp.getDefaultPortfolio().addStockByTicker($('ticker').value);
}