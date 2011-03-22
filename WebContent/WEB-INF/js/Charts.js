/**
 * DataSeries
 */
var ChartSeries = Class.create({
	
	initialize : function() {
		this.id = uid();
		this.color = cm.getColor();
		this.series = new Array();
		this.visible = true;
	},

	setSeries : function(array) {
		this.series = array;
	}

});

/**
 * General chart
 */
var GeneralChart = Class.create({
	
	initialize : function(canvasId, mainapp) {
		this.mainapp = mainapp;
		this.canvas = $(canvasId);
		this.series = new Hash();
		
		this.draw();
	},
	
	dispose : function() {
		
	},
	
	draw : function() {
		this.recalcCoordinates();
		this.canvas.width = this.canvas.width; // clear the canvas
		
		this.drawChart();
		
		this.drawAxis();
		this.writeXAxisLabels();
		this.writeYAxisLabels();
	},
	
	addSeries : function(chartSeries) {
		this.series.set(chartSeries.id, chartSeries);
		
		this.draw();
	},
	
	removeSeries : function(chartSeries) {
		this.series.unset(chartSeries.id);
		
		this.draw();
	},
	
	recalcCoordinates : function() { },
	
	drawChart : function() { },
	
	xOnCanvas : function(x) {
		return Math.round((x - this.minx) / 
				(this.maxx - this.minx) * (this.canvas.width - 2 * c_xMargin)) + 0.5 + c_xMargin;
	},
	
	yOnCanvas : function(y) {
		return Math.round(this.canvas.height - c_yMargin -
				(y - this.miny) / (this.maxy - this.miny) * (this.canvas.height - 2 * c_yMargin)) + 0.5;
	},
	
	xFromCanvas : function(x) {
		return this.minx + (x - c_xMargin) * (this.maxx - this.minx) / (this.canvas.width - 2 * c_xMargin);
	},
	
	yFromCanvas : function(y) {
		return this.maxy - (y - c_yMargin) * (this.maxy - this.miny) / (this.canvas.height - 2 * c_yMargin);
	},
	
	drawAxis : function() {
		var canvas = this.canvas.getContext('2d');
		
		canvas.beginPath();
		// X axis
		var y = this.yOnCanvas(Math.max(0, this.miny));
		canvas.moveTo(0, y);
		canvas.lineTo(this.canvas.width, y);
		canvas.lineTo(this.canvas.width - c_ArrowL, y - c_ArrowW);
		canvas.moveTo(this.canvas.width, y);
		canvas.lineTo(this.canvas.width - c_ArrowL, y + c_ArrowW);
		
		// Y axis
		var x = this.xOnCanvas(Math.max(0, this.minx))
		canvas.moveTo(x, this.canvas.height);
		canvas.lineTo(x, 0);
		canvas.lineTo(x + c_ArrowW, 0 + c_ArrowL);
		canvas.moveTo(x, 0);
		canvas.lineTo(x - c_ArrowW, 0 + c_ArrowL);
		
		canvas.strokeStyle = c_AxisColor;
		canvas.lineWidth = 1;
		canvas.stroke();
	},
	
	formatXAxisLabel : function(value) {
		return value;
	},
	
	formatYAxisLabel : function(value) {
		return value;
	},
	
	writeXAxisLabels : function() {
		var canvas = this.canvas.getContext('2d');
		canvas.beginPath();
		
		// Writing labels on X Axis
		canvas.textAlign = "center";
		canvas.textBaseline = "middle";
		canvas.font = c_LabelFont;
		canvas.lineWidth = 1;
		canvas.fillStyle = canvas.strokeStyle = c_LabelColor;
	
		var y = this.yOnCanvas(Math.max(0, this.miny));
		var yText = y + c_yMargin / 2;
		var d = (this.canvas.width / c_XLabelCount);
		for (i = 1; i < c_XLabelCount; i++) {
			var x = Math.round(d * i + d/2) + 0.5;
			canvas.moveTo(x, y);
			canvas.lineTo(x, y + c_ArrowW);
			
			canvas.fillText(this.formatXAxisLabel(this.xFromCanvas(x)), x, yText);
		}
		
		canvas.textAlign = "right";
		canvas.textBaseline = "bottom";
		canvas.fillText('time', this.canvas.width - c_ArrowL, y - c_ArrowW);
		
		canvas.stroke();
	},
	
	writeYAxisLabels : function() {
		var canvas = this.canvas.getContext('2d');
		canvas.beginPath();
		
		// Writing labels on X Axis
		canvas.textAlign = "right";
		canvas.textBaseline = "middle";
		canvas.font = c_LabelFont;
		canvas.lineWidth = 1;
		canvas.fillStyle = canvas.strokeStyle = c_LabelColor;
		
		var x = this.xOnCanvas(Math.max(0, this.minx));
		var xText = x - c_ArrowW * 2;
		var d = (this.canvas.height / c_YLabelCount);
		for (i = 0; i < c_YLabelCount - 1; i++) {
			y = Math.round(d * i + d/2) + 0.5;
			canvas.moveTo(x, y);
			canvas.lineTo(x - c_ArrowW, y);
			
			canvas.fillText(this.formatYAxisLabel(this.yFromCanvas(y)), xText, y);
		}
		
		canvas.textAlign = "left";
		canvas.textBaseline = "middle";
		canvas.fillText('value', x + c_ArrowW * 2, c_ArrowL);
		
		canvas.stroke();
	}
	
});

var LinearChart = Class.create(GeneralChart, {
	
	drawChart : function() {
		var canvas = this.canvas.getContext('2d');
		var values = this.series.values();
		var ts = this.getTimeScale();
		for (i = 0; i < values.length; i++) {
			var s = values[i];
			if (s.visible && s.series.length > 0) {
				canvas.beginPath();
				canvas.strokeStyle = s.color;
				canvas.lineWidth = 1;
				
				var x = this.xOnCanvas(this.minx);
				var y = this.yOnCanvas(s.series[0]);
				canvas.moveTo(x, y);
				for (j = 1; j < s.series.length; j++) {
					if (ts.x[j] >= this.minx && ts.x[j] <= this.maxx) {
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
		this.maxx = ts.x[ts.x.length-1];
		this.miny = 0;
		this.maxy = 0;
		
		var values = this.series.values();
		for (i = 0; i < values.length; i++) {
			var s = values[i].series;
			this.miny = Math.min(this.miny, s.min());
			this.maxy = Math.max(this.maxy, s.max());
		}
		
		this.minx = this.minx.getTime();
		this.maxx = this.maxx.getTime();
		if (this.miny == this.maxy) this.maxy += 100;
	},
	
	formatXAxisLabel : function(value) {
		return (new Date(value)).toShortString();
	},
	
	formatYAxisLabel : function(value) {
		return Math.round(value);
	}
	
});
