var DotChartSeries = Class.create(ChartSeries, {
	
	initialize : function($super) {
		$super();
		this.radius = psd_c_DotRadius;
		this.extSeries = new Array();
	},

	draw : function() {
		if (this.visible && this.extSeries.length > 0) {
			var context = this.chart.canvas.getContext('2d');
				
			context.strokeStyle = this.color;
			context.fillStyle = this.color;

			for (var i = 0; i < this.extSeries.length; i++) {
				var s = this.extSeries[i];
				
				var x = this.chart.xOnCanvas(s.x), y = this.chart.yOnCanvas(s.y);
				
				context.beginPath();
				context.arc(x, y, this.radius, 0, Math.PI * 2, false);
				context.closePath();
				context.fill();
				
				context.textAlign = "left";
				context.textBaseline = "top";
				context.fillText(s.label, x + this.radius, y + this.radius);
			}
			
			context.stroke();
		} 
	},
	
	// array must contain records with attributes: y - int, label - text
	setExtendedSeries : function(array) {
		var a2 = new Array();
		this.extSeries = array;
		for (var i = 0; i < array.length; i++)
			a2.push(array[i].y);
		this.setSeries(a2);
	}
	
});
