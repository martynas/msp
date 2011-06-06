var LinearChart = Class.create(GeneralChart, {
	
	drawChart : function() {
		var canvas = this.canvas.getContext('2d');
		var values = this.series.values();
		for (var i = 0; i < values.length; i++) {
			var s = values[i];
			if (s.visible && s.series.length > 0) {
				canvas.beginPath();
				canvas.strokeStyle = s.color;
				canvas.lineWidth = 1;
				
				var x = this.xOnCanvas(this.xValues[0]);
				var y = this.yOnCanvas(s.series[0]);
				canvas.moveTo(x, y);
				for (var j = 1; j < s.series.length; j++) {
					if (s.series[j] != 0) {
						x = this.xOnCanvas(this.xValues[j]);
						y = this.yOnCanvas(s.series[j]);
						canvas.lineTo(x, y);
					}
				}
				
				canvas.stroke();
			}
		} 
	},
	
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
		
		if (this.miny == this.maxy) this.maxy += 100;
	}
	
});
