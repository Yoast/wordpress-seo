var Description = require ('./Description');

module.exports = function ( i18n, value, description ) {
	this.value = value;
	this.description = new Description( i18n, description.value, description.replacements );

	// Added to not break BC
	this.score = this.value;
	this.text = this.description;

	return this;
}
