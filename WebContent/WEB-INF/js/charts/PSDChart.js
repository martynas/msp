// Portfolio Standard Deviation Chart

var PSDChart = Class.create(LinearChart, {
	
	createComponents : function($super) { 
		$super();
		this.components.push(new PSDChartAxisCC(this));
	}
	
});

var PSDChartAxisCC = Class.create(AxisCC, {
	
	initialize : function($super, chart) {
		$super(chart);
		this.c_XLabelCount = psd_c_XLabelCount;
	},
	
	formatXAxisLabel : function(value) {
		return value.toFixed(2);
	},
	
	formatYAxisLabel : function(value) {
		return (value * 100).toFixed(1) + '%';
	}
	
});