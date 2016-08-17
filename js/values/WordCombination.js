var functionWords = require( "../researches/english/functionWords" )();
var forEach = require( "lodash/forEach" );
var has = require( "lodash/has" );

/**
 * Returns whether or not the given word is a function word.
 *
 * @param {string} word The word to check.
 * @returns {boolean} Whether or not the word is a function word.
 */
function isFunctionWord( word ) {
	return -1 !== functionWords.indexOf( word.toLocaleLowerCase() );
}

/**
 * Represents a word combination in the context of relevant words.
 *
 * @constructor
 *
 * @param {string[]} words The list of words that this combination consists of.
 * @param {number} [occurrences] The number of occurrences, defaults to 0.
 */
function WordCombination( words, occurrences ) {
	this._words = words;
	this._length = words.length;
	this._occurrences = occurrences || 0;
}

WordCombination.lengthBonus = {
	"2": 2,
	"3": 4,
	"4": 6,
	"5": 8
};

/**
 * Returns the base relevance based on the length of this combination.
 *
 * @returns {number} The base relevance based on the length.
 */
WordCombination.prototype.getLengthBonus = function() {
	if ( has( WordCombination.lengthBonus, this._length ) ) {
		return WordCombination.lengthBonus[ this._length ];
	}

	return 0;
};

/**
 * Returns the combination as it occurs in the text.
 *
 * @returns {string} The combination.
 */
WordCombination.prototype.getCombination = function() {
	return this._words.join( " " );
};

/**
 * Returns the amount of occurrences of this word combination.
 *
 * @returns {number} The amount of occurrences.
 */
WordCombination.prototype.getOccurrences = function() {
	return this._occurrences;
};

/**
 * Increments the occurrences.
 */
WordCombination.prototype.incrementOccurrences = function() {
	this._occurrences += 1;
};

/**
 * Returns the relevance of the length.
 *
 * @param {number} relevantWordPercentage The relevance of the words within the combination.
 * @returns {number} The relevance based on the length and the word relevance.
 */
WordCombination.prototype.getMultiplier = function( relevantWordPercentage ) {
	var lengthBonus = this.getLengthBonus();

	// The relevance scales linearly from the relevance of one word to the maximum.
	return 1 + relevantWordPercentage * lengthBonus;

};

/**
 * Returns if the given word is a relevant word based on the given word relevance.
 */
WordCombination.prototype.isRelevantWord = function( word ) {
	return has( this._relevantWords, word );
};

/**
 * Returns the relevance of the words within this combination.
 */
WordCombination.prototype.getRelevantWordPercentage = function() {
	var relevantWordCount = 0, wordRelevance = 1;

	if ( this._length > 1 ) {
		forEach( this._words, function ( word ) {
			if ( this.isRelevantWord( word ) ) {
				relevantWordCount += 1;
			}
		}.bind( this ) );

		wordRelevance = relevantWordCount / this._length;
	}

	return wordRelevance;
};

/**
 * Returns the relevance for this word combination.
 */
WordCombination.prototype.getRelevance = function() {
	var relevance = 0;

	if ( this._words.length === 1 && isFunctionWord( this._words[ 0 ] ) ) {
		return 0;
	}

	var wordRelevance = this.getRelevantWordPercentage();
	if ( wordRelevance === 0 ) {
		return 0;
	}

	relevance = this.getMultiplier( wordRelevance ) * this._occurrences;

	return relevance;
};

/**
 * Sets the relevance of single words
 *
 * @param {Object} relevantWords A mapping from a word to a relevance.
 */
WordCombination.prototype.setRelevantWords = function( relevantWords ) {
	this._relevantWords = relevantWords;
};

/**
 * Returns the density of this combination within the text.
 *
 * @param {number} wordCount The word count of the text this combination was found in.
 * @returns {number} The density of this combination.
 */
WordCombination.prototype.getDensity = function( wordCount ) {
	return this._occurrences / wordCount;
};

module.exports = WordCombination;
