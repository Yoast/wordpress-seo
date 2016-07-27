var forEach = require( "lodash/forEach" );

/**
 * Creates an Exclusion Count Step, used for counting syllables in exclusion words.
 * @param {object} config The config containing the exclusion words.
 * @constructor
 */
var ExclusionCountStep = function( config ) {
	this._regexBeginLetters = config.regexBeginLetters || [];
	this._regexEndLetters = config.regexEndLetters || [];
	this._regexAnywhereLetters = config.regexAnywhereLetters || [];
	this._matchBegin = config.matchBeginning || false;
	this._matchEnd = config.matchEnd || false;
	this._exclusionParts = config.exclusionParts;
};

/**
 * Creates a regex based on the given begin letter string in the config.
 *
 * @param {string} word The word to use in the regex.
 * @returns {Array} A list with parts for the regex.
 */
ExclusionCountStep.prototype.createRegexBeginLetters = function( word ) {
	var regexParts = [];

	if( this._regexBeginLetters.length === 0 ) {
		return regexParts;
	}

	forEach( this._regexBeginLetters, function( letter ) {
		if( this._matchBegin ) {
			regexParts.push( "^" + word + letter );
		}
	}.bind( this ) );

	return regexParts;
};

/**
 * Creates a regex based on the given end letter string in the config.
 *
 * @param {string} word The word to use in the regex.
 * @returns {Array} A list with parts for the regex.
 */
ExclusionCountStep.prototype.createRegexEndLetters = function( word ) {
	var regexParts = [];

	if( this._regexEndLetters.length === 0 ) {
		return regexParts;
	}

	forEach( this._regexEndLetters, function( letter ) {
		if( this._matchEnd ) {
			regexParts.push( word + letter + "$" );
		}
	}.bind( this ) );

	return regexParts;
};

/**
 * Creates a regex based on the given anywhere letter string in the config.
 *
 * @param {string} word The word to use in the regex.
 * @returns {Array} A list with parts for the regex.
 */
ExclusionCountStep.prototype.createRegexAnywhereLetters = function( word ) {
	var regexParts = [];

	if( this._regexAnywhereLetters.length === 0 ) {
		return regexParts;
	}

	forEach( this._regexAnywhereLetters, function( letter ) {
		regexParts.push( word + letter );
	} );

	return regexParts;
};

/**
 * Creates the regex based on the regexLetters from the config.
 *
 * @param {string} word The word to use in the regex.
 * @returns {RegExp} The created regular expression.
 */
ExclusionCountStep.prototype.createRegex = function( word ) {
	var regexParts = [];

	regexParts = regexParts.concat( this.createRegexBeginLetters( word ) );

	regexParts = regexParts.concat( this.createRegexEndLetters( word ) );

	regexParts = regexParts.concat( this.createRegexAnywhereLetters( word ) );

	if( this._matchBegin && this._regexBeginLetters.length === 0 ) {
		regexParts.push( "^" + word );
	}

	if( this._matchEnd && this._regexEndLetters.length === 0 ) {
		regexParts.push(  word + "$" );
	}

	if( this._regexEndLetters.length !== 0 ) {
		regexParts.concat( this.createRegexEndLetters( word ) );
	}

	var regexString = "(" + regexParts.join( "|" ) + ")";

	if( regexParts.length !== 0 ) {
		return new RegExp( regexString );
	}
	return new RegExp( word );
};

/**
 * Match the word against the exclusion.
 *
 * @param {string} word The word to match the exclusion against.
 * @param {string} exclusion The exclusion word to match the word in.
 * @returns {Array} The found matches in the exclusion word.
 */
ExclusionCountStep.prototype.matchExclusion = function( word, exclusion ) {
	return word.match( this.createRegex( exclusion ) ) || [];
};

/**
 * Checks if the found word is a valid exclusion.
 *
 * @param {string} word The word to match the exclusion against.
 * @param {string} exclusion The exclusion word to match the word in.
 * @returns {boolean} True if it is a valid exclusion word, false if it isn't.
 */
ExclusionCountStep.prototype.isValidExclusion = function( word, exclusion ) {
	return this.matchExclusion( word, exclusion ).length !== 0;
};

/**
 * Checks if the word is in the exclusion parts list, returns the exclusion part where
 * the word is found in.
 *
 * @param {string} word The word to find in the exclusion parts.
 * @returns {string} The found exclusion part.
 */
ExclusionCountStep.prototype.findWord = function( word ) {
	var foundExclusionPart = "";
	forEach( this._exclusionParts, function( exclusionPart ) {
		if( word.indexOf( exclusionPart.word ) > -1 && this.isValidExclusion( word, exclusionPart.word ) ) {
			foundExclusionPart = exclusionPart;
		}
	}.bind( this ) );
	return foundExclusionPart;
};

/**
 * Modifies the word by replacing the found exclusion part with a space so it isn't calculated
 * in the other syllables counts.
 *
 * @param {string} word The word to modify.
 * @param {object} exclusionPart The exclusion part containing the part to replace
 * @returns {string} The modified word.
 */
ExclusionCountStep.prototype.modifyWord = function( word, exclusionPart ) {
	return word.replace( exclusionPart.word, " " );
};

/**
 * Gets the number of syllables in the exclusion part.
 *
 * @param {object} exclusionPart The exclusion part containing the syllables.
 * @returns {number} The number of syllables in the exclusion part.
 */
ExclusionCountStep.prototype.getSyllables = function( exclusionPart ) {
	return exclusionPart.syllables;
};

/**
 * Counts syllable in a word by matching it in the exclusion list.
 * If syllables are found, the exclusion part is removed from the word and the word is passed on.
 * This way it the remainder can be used in the other syllable counts.
 *
 * @param {string} word The word to count the syllables in.
 * @returns {object} The number of syllables found and the word after modification.
 */
ExclusionCountStep.prototype.countSyllables = function ( word ) {
	var syllableCount = 0;
	var exclusionPart = this.findWord( word );

	if( exclusionPart !== "" ) {
		syllableCount = this.getSyllables( exclusionPart );
		word = this.modifyWord( word, exclusionPart );
	}

	return( { syllableCount: syllableCount, word: word } );
};

module.exports = ExclusionCountStep;
