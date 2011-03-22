Array.prototype.stdDev = function() {
	var a = this.mean();
	var e = this.length;
	for ( var c = 0, b = 0; c < e; c++) {
		b += Math.pow(this[c] - a, 2)
	}
	var d = Math.sqrt(b / e);
	return d
};

Array.prototype.variance = function() {
	var a = this.mean();
	var e = this.length;
	for ( var d = 0, b = 0; d < e; d++) {
		b += Math.pow(this[d] - a, 2)
	}
	var c = b / e;
	return c
};

Array.prototype.sum = function() {
	for ( var a = 0, c = this.length, b = 0; a < c; b += this[a++]) {
	}
	return b
};

Array.prototype.mean = function() {
	for ( var b = 0, d = this.length, c = 0; b < d; c += this[b++]) {
	}
	var a = c / d;
	return a
};

Array.prototype.max = function() {
	return Math.max.apply(Math, this)
};

Array.prototype.min = function() {
	return Math.min.apply(Math, this)
};

Array.prototype.median = function() {
	var d = this.length;
	if (d % 2 == 1) {
		var b = Math.floor(d / 2);
		var c = this.sortNumber()[b]
	} else {
		var b = d / 2;
		var a = this.sortNumber();
		var c = (a[b - 1] + a[b]) / 2
	}
	return c
};

Array.prototype.sortNumber = function(a) {
	if (a == true) {
		return this.sort(function(d, c) {
			return d - c
		}).reverse()
	} else {
		return this.sort(function(d, c) {
			return d - c
		})
	}
};

function normsinv(g) {
	var m = new Array(-39.69683028665376, 220.9460984245205,
			-275.9285104469687, 138.357751867269, -30.66479806614716,
			2.506628277459239);
	var l = new Array(-54.47609879822406, 161.5858368580409,
			-155.6989798598866, 66.80131188771972, -13.28068155288572);
	var k = new Array(-0.007784894002430293, -0.3223964580411365,
			-2.400758277161838, -2.549732539343734, 4.374664141464968,
			2.938163982698783);
	var j = new Array(0.007784695709041462, 0.3224671290700398,
			2.445134137142996, 3.754408661907416);
	var h = 0.02425;
	var i = 1 - h;
	if (g < h) {
		var f = Math.sqrt(-2 * Math.log(g));
		return (((((k[0] * f + k[1]) * f + k[2]) * f + k[3]) * f + k[4]) * f + k[5])
				/ ((((j[0] * f + j[1]) * f + j[2]) * f + j[3]) * f + 1)
	}
	if (i < g) {
		var f = Math.sqrt(-2 * Math.log(1 - g));
		return -(((((k[0] * f + k[1]) * f + k[2]) * f + k[3]) * f + k[4]) * f + k[5])
				/ ((((j[0] * f + j[1]) * f + j[2]) * f + j[3]) * f + 1)
	}
	var f = g - 0.5;
	var e = f * f;
	return (((((m[0] * e + m[1]) * e + m[2]) * e + m[3]) * e + m[4]) * e + m[5])
			* f
			/ (((((l[0] * e + l[1]) * e + l[2]) * e + l[3]) * e + l[4]) * e + 1)
};