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
		this.components = new Array();
		this.xValues = null;
		this.createComponents();
		
		this.draw();
	},
	
	dispose : function() {
		
	},
	
	setXValues : function(array) {
		this.xValues = array;
	},
	
	createComponents : function() { },
	
	drawComponents : function(drawStage) {
		for (var i = 0; i < this.components.length; i++) {
			var c = this.components[i];
			if (c.drawStage == drawStage)
				c.draw();
		}
	},
	
	draw : function() {
		this.recalcCoordinates();
		this.canvas.width = this.canvas.width; // clear the canvas
		
		this.drawComponents(CCDrawStage.Early);
		this.drawChart();
		this.drawComponents(CCDrawStage.Late);
	},
	
	addSeries : function(chartSeries) {
		this.series.set(chartSeries.id, chartSeries);
		
		this.draw();
	},
	
	removeSeries : function(chartSeries) {
		this.series.unset(chartSeries.id);
		
		this.draw();
	},
	
	recalcCoordinates : function() {
	},
	
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
	}
	
});

var CCDrawStage = {
	Early: 0,
	Late: 1
};

var ChartComponent = Class.create({
	
	initialize : function(chart) {
		this.chart = chart;
		this.drawStage = CCDrawStage.Early;
	},
	
	draw : function() {}
	
});

var AxisCC = Class.create(ChartComponent, {
	
	initialize : function($super, chart) {
		this.c_XLabelCount = c_XLabelCount;
		this.c_YLabelCount = c_YLabelCount;
		
		$super(chart);
		this.drawStage = CCDrawStage.Late;
	},
	
	draw : function() {
		this.drawAxis();
		this.writeXAxisLabels();
		this.writeYAxisLabels();
	},
	
	drawAxis : function() {
		var canvas = this.chart.canvas;
		var context = canvas.getContext('2d');
		
		context.beginPath();
		// X axis
		var y = this.chart.yOnCanvas(Math.max(0, this.chart.miny));
		context.moveTo(0, y);
		context.lineTo(canvas.width, y);
		context.lineTo(canvas.width - c_ArrowL, y - c_ArrowW);
		context.moveTo(canvas.width, y);
		context.lineTo(canvas.width - c_ArrowL, y + c_ArrowW);
		
		// Y axis
		var x = c_yAxisMargin + 0.5;
		context.moveTo(x, canvas.height);
		context.lineTo(x, 0);
		context.lineTo(x + c_ArrowW, 0 + c_ArrowL);
		context.moveTo(x, 0);
		context.lineTo(x - c_ArrowW, 0 + c_ArrowL);
		
		context.strokeStyle = c_AxisColor;
		context.lineWidth = 1;
		context.stroke();
	},
	
	formatXAxisLabel : function(value) {
		return value;
	},
	
	formatYAxisLabel : function(value) {
		return value;
	},
	
	writeXAxisLabels : function() {
		var canvas = this.chart.canvas;
		var context = canvas.getContext('2d');
		
		context.beginPath();
		
		// Writing labels on X Axis
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = c_LabelFont;
		context.lineWidth = 1;
		context.fillStyle = context.strokeStyle = c_LabelColor;
	
		var y = this.chart.yOnCanvas(Math.max(0, this.chart.miny));
		var yText = y + c_yMargin / 2;
		var d = (canvas.width / this.c_XLabelCount);
		for (var i = 1; i < this.c_XLabelCount; i++) {
			var x = Math.round(d * i + d/2) + 0.5;
			context.moveTo(x, y);
			context.lineTo(x, y + c_ArrowW);
			
			context.fillText(this.formatXAxisLabel(this.chart.xFromCanvas(x)), x, yText);
		}
		
		context.textAlign = "right";
		context.textBaseline = "bottom";
		context.fillText('time', canvas.width - c_ArrowL, y - c_ArrowW);
		
		context.stroke();
	},
	
	writeYAxisLabels : function() {
		var canvas = this.chart.canvas;
		var context = canvas.getContext('2d');
		
		context.beginPath();
		
		// Writing labels on X Axis
		context.textAlign = "right";
		context.textBaseline = "middle";
		context.font = c_LabelFont;
		context.lineWidth = 1;
		context.fillStyle = context.strokeStyle = c_LabelColor;
		
		var x = c_yAxisMargin;
		var xText = x - c_ArrowW * 2;
		var d = (canvas.height / this.c_YLabelCount);
		for (var i = 0; i < this.c_YLabelCount - 1; i++) {
			y = Math.round(d * i + d/2) + 0.5;
			context.moveTo(x, y);
			context.lineTo(x - c_ArrowW, y);
			
			context.fillText(this.formatYAxisLabel(this.chart.yFromCanvas(y)), xText, y);
		}
		
		context.textAlign = "left";
		context.textBaseline = "middle";
		context.fillText('value', x + c_ArrowW * 2, c_ArrowL);
		
		context.stroke();
	}
	
});