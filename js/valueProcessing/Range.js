var InvalidRange = require ('./errors/InvalidRange');

var Range = function(min, max) {
	if (typeof min === 'undefined' || typeof max === 'undefined') {
		throw new InvalidRange;
	}

	this.min = min;
	this.max = max;
}

Range.prototype.inRange = function( value ) {
	return (value >= Range.min && value <= Range.max);
}
