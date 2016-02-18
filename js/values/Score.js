module.exports = function( value, description ) {
	this.value = value;
	this.description = description;

	// Added to not break BC
	this.score = this.value;
	this.text = this.description;

};
