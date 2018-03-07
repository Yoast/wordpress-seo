var getType = require( "./../helpers/types.js" ).getType;
var isSameType = require( "./../helpers/types.js" ).isSameType;

var defaults = require( "lodash/defaults" );
var forEach = require( "lodash/forEach" );

/**
 * Default attributes to be used by the Participle if they are left undefined.
 * @type { { auxiliaries: array, type: string } }
 */
var defaultAttributes = {
	auxiliaries: [],
	type: "",
	language: "",
};

/**
 * Validates the type of all attributes. Throws an error if the type is invalid.
 *
 * @param {object} attributes The object containing all attributes.
 * @returns {void}
 */
var validateAttributes = function( attributes ) {
	forEach( attributes, function( attributeValue, attributeName ) {
		var expectedType = getType( defaultAttributes[ attributeName ] );
		if ( isSameType( attributeValue, expectedType ) === false ) {
			throw Error( "Attribute " + attributeName + " has invalid type. Expected " + expectedType + ", got " + getType( attributeValue ) + "." );
		}
	} );
};

/**
 * Construct the Participle object and set the participle, sentence part, auxiliary and type.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part where the participle is from.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Participle = function( participle, sentencePart, attributes ) {
	this.setParticiple( participle );
	this.setSentencePart( sentencePart );
	this._determinesSentencePartIsPassive = false;

	attributes = attributes || {};

	defaults( attributes, defaultAttributes );

	validateAttributes( attributes );

	this._attributes = attributes;
};

/**
 * Sets the participle.
 * @param {string} participle The participle.
 * @returns {void}.
 */
Participle.prototype.setParticiple = function( participle ) {
	if ( participle === "" ) {
		throw Error( "The participle should not be empty." );
	}
	this._participle = participle;
};

/**
 * Returns the participle.
 * @returns {String} The participle.
 */
Participle.prototype.getParticiple = function() {
	return this._participle;
};

/**
 * Sets the SentencePart.
 *
 * @param {string} sentencePart The sentence part.
 * @returns {void}.
 */
Participle.prototype.setSentencePart = function( sentencePart ) {
	if ( sentencePart === "" ) {
		throw Error( "The sentence part should not be empty." );
	}
	this._sentencePart = sentencePart;
};

/**
 * Returns the sentence part.
 * @returns {String} The sentence part.
 */
Participle.prototype.getSentencePart = function() {
	return this._sentencePart;
};

/**
 * Returns the type.
 * @returns {String} The type.
 */
Participle.prototype.getType = function() {
	return this._attributes.type;
};

/**
 * Returns the auxiliaries.
 * @returns {String} The auxiliaries.
 */
Participle.prototype.getAuxiliaries = function() {
	return this._attributes.auxiliaries;
};

/**
 * Returns the language.
 * @returns {string} The language.
 */
Participle.prototype.getLanguage = function() {
	return this._attributes.language;
};

/**
 * Returns if the participle is passive or not.
 * @returns {boolean} True if it is passive.
 */
Participle.prototype.determinesSentencePartIsPassive = function() {
	return this._determinesSentencePartIsPassive;
};

/**
 * Determines if the sentence is passive or not.
 * @param {boolean} passive Whether the sentence part is passive.
 * @returns {void}
 */
Participle.prototype.setSentencePartPassiveness = function( passive ) {
	if ( ! isSameType( passive, "boolean" ) ) {
		throw Error( "Passiveness had invalid type. Expected boolean, got " + getType( passive ) + "." );
	}
	this._determinesSentencePartIsPassive = passive;
};

module.exports = Participle;
