var QuotesChart = Class.create(LinearChart, {
	
	getTimeScale : function() {
		return this.mainapp.getTimeScale();
	},
	
	createComponents : function($super) { 
		$super();
		this.components.push(new QuotesChartAxisCC(this));
		this.components.push(new TimeLineCC(this));
	}
	
});

var QuotesChartAxisCC = Class.create(AxisCC, {
	
	formatXAxisLabel : function(value) {
		return (new Date(value)).toShortString();
	},
	
	formatYAxisLabel : function(value) {
		return Math.round(value);
	}
	
});

var TimeLineCC = Class.create(ChartComponent, {
	
	initialize : function($super, chart) {
		$super(chart);
		this.drawStage = CCDrawStage.Late;
	},
	
	draw : function() {
		var ts = this.chart.getTimeScale();
		var canvas = this.chart.canvas;
		var context = canvas.getContext('2d');
		
		context.beginPath();
		context.strokeStyle = c_TimeLineColor;
		context.lineWidth = 1;
		
		var x = this.chart.xOnCanvas(ts.x[ts.currentTime]);
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height);
		
		context.textAlign = "left";
		context.textBaseline = "middle";
		context.font = c_LabelFont;
		context.fillText('current time', x + c_ArrowW, c_ArrowL);
		
		context.stroke();
	}
	
});
