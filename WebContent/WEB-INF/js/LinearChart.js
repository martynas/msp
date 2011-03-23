var LinearChart = Class.create(GeneralChart, {
	
	drawChart : function() {
		var canvas = this.canvas.getContext('2d');
		var values = this.series.values();
		var ts = this.getTimeScale();
		for (var i = 0; i < values.length; i++) {
			var s = values[i];
			if (s.visible && s.series.length > 0) {
				canvas.beginPath();
				canvas.strokeStyle = s.color;
				canvas.lineWidth = 1;
				
				var x = this.xOnCanvas(ts.xNumber[ts.timeStart]);
				var y = this.yOnCanvas(s.series[ts.timeStart]);
				canvas.moveTo(x, y);
				for (var j = ts.timeStart + 1; j < s.series.length; j++) {
					if (s.series[j] != 0) {
						x = this.xOnCanvas(ts.x[j]);
						y = this.yOnCanvas(s.series[j]);
						canvas.lineTo(x, y);
					}
				}
				
				canvas.stroke();
			}
		} 
	},
	
	getTimeScale : function() {
		return this.mainapp.getTimeScale();
	},
	
	recalcCoordinates : function() {
		var ts = this.getTimeScale();
		
		this.minx = ts.x[ts.timeStart];
		this.maxx = ts.x[ts.timeEnd];
		this.miny = 0;
		this.maxy = 0;
		
		var values = this.series.values();
		for (var i = 0; i < values.length; i++) {
			var s = values[i].series;
			this.miny = Math.min(this.miny, s.min());
			this.maxy = Math.max(this.maxy, s.max());
		}
		
		this.minx = this.minx.getTime();
		this.maxx = this.maxx.getTime();
		if (this.miny == this.maxy) this.maxy += 100;
	},
	
	createComponents : function($super) { 
		$super();
		this.components.push(new LinearChartAxisCC(this));
		this.components.push(new TimeLineCC(this));
	},
	
});

var LinearChartAxisCC = Class.create(AxisCC, {
	
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