var Paper = require( "./values/Paper.js" );
var merge = require( "lodash/object/merge" );
var wordCount = require( "./stringProcessing/countWords.js" );
var InvalidTypeError = require( "./errors/invalidType" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/lang/isUndefined" );
var isEmpty = require( "lodash/lang/isEmpty" );

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.updatePaper( paper );

	this.defaultResearches = {
		"wordCount": wordCount
	};

	this.customResearches = {};
};

/**
 * Update the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
Researcher.prototype.updatePaper = function( paper ) {
	if ( !( paper instanceof Paper ) ) {
		throw new InvalidTypeError( "The researcher requires an Paper object." );
	}

	this.paper = paper;
};

/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 */
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires an Function callback." );
	}

	this.customResearches[name] = research;
};

/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() )
	             .filter( function( research ) {
		             return research === name;
				} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {boolean|callback}
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !this.hasResearch( name ) ) {
		return false;
	}

	return this.getAvailableResearches()[ name ]( this.paper );
};

module.exports = Researcher;
