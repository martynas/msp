var Statistics = Class.create({
	
	initialize : function(xArray, vMatrix) {
		this.xArray = xArray;
		this.vMatrix = vMatrix;
		this.vars = null;
		this.count = this.xArray.length;
		this.covM = null; // Covariance Matrix
		this.corrM = null; // Correlation Matrix
		this.portfolios = null; // Possible combinations of portfolios
		
		this.stat = false; // Indication if global statistics calculations are done
		
		this.weights = null;
		this.multipier = 0;
	},
	
	// Function calculating various combinations of porfolios
	calculatePortfolios : function() {
		this.portfolios = new Array();
		
		// Looking for possible maximal return and minimal risk
		var maxMean, minStDev;
		for (var i = 0; i < this.vars.length; i++) {
			var v = this.vars[i];
			if (!maxMean || maxMean.mean < v.mean) maxMean = v;
			if (!minStDev || minStDev.s > v.s) minStDev = v;
		}
		this.portfolios.push(minStDev);
		this.portfolios.push(maxMean);
	},
	
	calculateStatistics : function() {
		if (!this.stat) {
			this.vars = new Array();
			var varsCount = this.vMatrix.rows();
			
			// Matrix representing ratios of value changes
			this.vrMatrix = Matrix.Zero(this.vMatrix.rows(), this.vMatrix.cols()-1);
			for (var i = 0; i < this.vrMatrix.rows(); i++) {
				for (var j = 1; j < this.vrMatrix.cols(); j++)
					this.vrMatrix.elements[i][j-1] = 
						(this.vMatrix.elements[i][j] - this.vMatrix.elements[i][j-1]) / 
						this.vMatrix.elements[i][j-1];
			}
			
			for (var i = 0; i < varsCount; i++) {
				this.vars.push({});
				var els = this.vrMatrix.elements[i];
				
				// Mean
				this.vars[i].mean = els.sum() / this.count;
				
				// Variance, Standard Deviation
				var s2 = 0;
				for (var j = 0; j < els.length; j++)
					s2 += Math.pow(els[j] - this.vars[i].mean, 2);
				this.vars[i].s2 = s2 / this.count;
				this.vars[i].s = Math.sqrt(this.vars[i].s2);
			}
			
			// Creating covariance and correlation Matrices
			this.covM = Matrix.I(varsCount);
			this.corrM = Matrix.I(varsCount);
			for (var i = 0; i < varsCount-1; i++) {
				var els1 = this.vrMatrix.elements[i], v1 = this.vars[i];
				for (var j = i+1; j < varsCount; j++) {
					var els2 = this.vrMatrix.elements[i], cov = 0, v2 = this.vars[j];
					for (var k = 0; k < els1.length; k++)
						cov += (els1[k] - v1.mean) * (els2[k] - v2.mean);
					cov = cov / this.count;
					
					this.covM.elements[i][j] = this.covM.elements[j][i] = cov;
					this.corrM.elements[i][j] = this.corrM.elements[j][i] = cov/(v1.s * v2.s);
				}
			}
			
			this.calculatePortfolios();
			
			this.stat = true;
		}
		return this.stat;
	},
	
	calculateProduct : function(weights, multipier) {
		if (this.calculateStatistics()) {
			this.wMatrix = $M(weights);
			this.yMatrix = this.wMatrix.x(multipier).transpose().x(this.vMatrix);
			this.yArray = this.yMatrix.elements[0];
			
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
	
	getPValue : function() {
		return this.yArray;
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