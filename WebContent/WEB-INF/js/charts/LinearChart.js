var LinearChart = Class.create(GeneralChart, {
	
	recalcCoordinates : function() {
		this.minx = (this.xValues) ? this.xValues.min() : -1;
		this.maxx = (this.xValues) ? this.xValues.max() : 1;
		this.miny = 0;
		this.maxy = 0;
		
		var values = this.series.values();
		for (var i = 0; i < values.length; i++) {
			var s = values[i].series;
			this.miny = Math.min(this.miny, s.min());
			this.maxy = Math.max(this.maxy, s.max());
		}
		
		if (this.miny == this.maxy) {
			this.maxy += 10;
		}
		if (this.minx == this.maxx) { 
			this.minx -= 0.1;
			this.maxx += 0.1;
		}
	}
	
});

var LinearChartSeries = Class.create(ChartSeries, {

	draw : function() {
		if (this.visible && this.series.length > 0) {
			var context = this.chart.canvas.getContext('2d');
				
			context.beginPath();
			context.strokeStyle = this.color;
			context.lineWidth = 1;
				
			var x = this.chart.xOnCanvas(this.chart.xValues[0]);
			var y = this.chart.yOnCanvas(this.series[0]);
			context.moveTo(x, y);
			for (var j = 1; j < this.series.length; j++) {
				if (this.series[j] != 0) {
					x = this.chart.xOnCanvas(this.chart.xValues[j]);
					y = this.chart.yOnCanvas(this.series[j]);
					context.lineTo(x, y);
				}
			}
				
			context.stroke();
		} 
	}
	
});