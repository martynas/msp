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
	},
	
	dispose : function() {
		
	},
	
	draw : function() {
		this.recalcCoordinates();
		this.canvas.width = this.canvas.width; // clear the canvas
	},
	
	addSeries : function(chartSeries) {
		this.series.set(chartSeries.id, chartSeries);
		
		this.draw();
	},
	
	removeSeries : function(chartSeries) {
		this.series.unset(chartSeries.id);
		
		this.draw();
	},
	
	getTimeScale : function() {
		return this.mainapp.getTimeScale();
	},
	
	recalcCoordinates : function() {
		var ts = this.getTimeScale();
		
		this.minx = NaN;
		this.maxx = ts.x[ts.x.length-1];
		this.miny = 0;
		this.maxy = 0;
		
		var values = this.series.values();
		for (i = 0; i < values.length; i++) {
			var s = values[i].series;
			for (j = 0; j < s.length; j++) {
				if (s[j] != 0 && (isNaN(this.minx) || this.minx > ts.x[j])) {
					this.minx = ts.x[j];
				};
				this.miny = Math.min(this.miny, s[j]);
				this.maxy = Math.max(this.maxy, s[j]);
			};
		};
		
		if (isNaN(this.minx)) {
			this.minx = ts.x[0];
		};
	},
	
	xOnCanvas : function(x) {
		return Math.round((x - this.minx) / (this.maxx - this.minx) * this.canvas.width) + 0.5;
	},
	
	yOnCanvas : function(y) {
		return Math.round(this.canvas.height - (y - this.miny) / (this.maxy - this.miny) * this.canvas.height) + 0.5;
	}
	
});

var LinearChart = Class.create(GeneralChart, {
	
	draw : function($super) {
		$super();
		
		var canvas = this.canvas.getContext('2d');
		var values = this.series.values();
		var ts = this.getTimeScale();
		for (i = 0; i < values.length; i++) {
			var s = values[i];
			if (s.visible && s.series.length > 0) {
				canvas.strokeStyle = s.color;
				canvas.lineWidth = 1;
				canvas.beginPath();
				
				var x = this.xOnCanvas(ts.x[0]);
				var y = this.yOnCanvas(s.series[0]);
				canvas.moveTo(x, y);
				for (j = 1; j < s.series.length; j++) {
					x = this.xOnCanvas(ts.x[j]);
					y = this.yOnCanvas(s.series[j]);
					canvas.lineTo(x, y);
				}
				
				canvas.stroke();
			}
		} 
	}
	
});
