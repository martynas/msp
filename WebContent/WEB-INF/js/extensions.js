// Date
Date.prototype.getMonthName = function() {
    return Date.locale['en'].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function() {
    return Date.locale['en'].month_names_short[this.getMonth()];
};

Date.prototype.toShortString = function() {
	var s = this.getFullYear().toString() + this.getMonthNameShort();
	return s;
};

Date.locale = {
    en: {
       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

// Array
Array.prototype.remove = function(a) {
	for(i = 0; i < this.length; i++) {
		if (this[i] == a) {
			this.splice(i, 1);
			break;
		}
	}
};

// Adds n e elements to be begging of an array
Array.prototype.lpad = function(n, e) {
	var na = new Array();
	for (var i = 0; i < n; i++)
		na.push(e);
	return na.concat(this);
};