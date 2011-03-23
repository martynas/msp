var Statistics = Class.create({
	
	initialize : function(xArray, yArray) {
		this.xArray = xArray;
		this.yArray = yArray;
		
		this.count = Math.min(this.xArray.length, this.yArray.length);
		if (this.count > 0) {
			this.basics();
			this.trendLine();
		}
	},
	
	basics : function() {
		this.xSum = this.xArray.sum();
		this.ySum = this.yArray.sum();
		
		this.xySum = 0;
		this.xxSum = 0;
		for (var i = 0; i < this.count; i++) {
			this.xySum += this.xArray[i] * this.yArray[i];
			this.xxSum += this.xArray[i] * this.xArray[i];
		}
	},
	
	trendLine : function() {
		// Calculating Slope
		var a = ((this.count * this.xxSum) - (this.xSum * this.xSum));
		if (a == 0)
			this.slope = 0;
		else
			this.slope = ((this.count * this.xySum) - (this.xSum * this.ySum)) / a;
		
		// Intercept
		this.intercept = (this.ySum - (this.slope * this.xSum)) / this.count;
	},
	
	trendLineValue : function(x) {
		return (x * this.slope + this.intercept);
	}
	
});