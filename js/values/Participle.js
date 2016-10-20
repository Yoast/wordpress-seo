var defaults = require( "lodash/defaults" );
var forEach = require( "lodash/forEach" );

/**
 * Default attributes to be used by the Participle if they are left undefined.
 * @type { { auxiliaries: array, type: string } }
 */
var defaultAttributes = {
	auxiliaries: [],
	type: "",
};
/**
 * Gets the parsed type name of attributes.
 *
 * @param {array|object|string|number} attribute The attribute to get the parsed type from.
 * @returns {string} The parsed type name.
 */
var getType = function( attribute ) {
	var rawTypeName = toString.call( attribute );
	var parsedTypeName = "undefined";

	switch( rawTypeName ) {
		case "[object Array]":
			parsedTypeName =  "array";
			break;
		case "[object Object]":
			parsedTypeName = "object";
			break;
		case "[object String]":
			parsedTypeName = "string";
			break;
		case "[object Number]":
			parsedTypeName = "number";
			break;
		case "[object Boolean]":
			parsedTypeName = "boolean";
			break;
		default:
			return rawTypeName;
	}
	return parsedTypeName;
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
	this._participle = participle || "";
	this._sentencePart = sentencePart || "";
	this._determinesSentencePartIsPassive = false;

	if ( this._participle === "" ) {
		throw Error( "The participle should not be empty." );
	}

	if ( this._sentencePart === "" ) {
		throw Error( "The sentence part should not be empty." );
	}

	attributes = attributes || {};

	this.validateAttributes( attributes );

	defaults( attributes, defaultAttributes );
	this._attributes = attributes;
};

/**
 * Validates the type of all attributes. Throws an error if the type is invalid.
 *
 * @param {object} attributes The object containing all attributes.
 * @returns {void}
 */
Participle.prototype.validateAttributes = function( attributes ) {
	forEach( attributes, function( attributeValue, attributeName ) {
		var passedType = getType( attributeValue );
		var expectedType = getType( defaultAttributes[ attributeName ] );

		if ( expectedType === "undefined" ) {
			return;
		}

		if( passedType !== expectedType ) {
			throw Error( "Attribute " + attributeName + " has invalid type. Expecting " + expectedType + ", got " + passedType + "." );
		}
	} );
};

/**
 * Returns the participle.
 * @returns {String} The participle.
 */
Participle.prototype.getParticiple = function() {
	return this._participle;
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
	var passiveType = getType( passive );
	if ( passiveType !== "boolean" ) {
		throw Error( "Passiveness had invalid type. Expected boolean, got " + passiveType + "." );
	}
	this._determinesSentencePartIsPassive = passive;
};

module.exports = Participle;
