var Description = require ('./Description');

module.exports = function ( i18n, weight, description ) {
//	return "je moeder";
	this.weight = weight;
	this.description = new Description( i18n, description.value, description.replacements );

	// Added to not break BC
	this.score = this.weight;
	this.text = this.description;

	return this;
}
