/**
 * Represents a word combination in the context of relevant words.
 *
 * @constructor
 *
 * @param {string} word The word.
 * @param {string} stem The stem / base form of the word.
 * @param {number} [occurrences] The number of occurrences, defaults to 0.
 */
function WordCombination( word, stem, occurrences ) {
	this._word = word;
	this._stem = stem;
	this._occurrences = occurrences || 0;
}

/**
 * Sets the word to the word combination.
 * @param {string} word The word to set.
 * @returns {void}.
 */
WordCombination.prototype.setWord = function( word ) {
	this._word = word;
};

/**
 * Returns the word.
 *
 * @returns {string} The word.
 */
WordCombination.prototype.getWord = function() {
	return this._word;
};

/**
 * Returns the stem of the word.
 *
 * @returns {string} The stem.
 */
WordCombination.prototype.getStem = function() {
	return this._stem;
};

/**
 * Sets the number of occurrences to the word.
 * @param {int} numberOfOccurrences The number of occurrences to set.
 * @returns {void}.
 */
WordCombination.prototype.setOccurrences = function( numberOfOccurrences ) {
	this._occurrences = numberOfOccurrences;
};

/**
 * Returns the amount of occurrences of this word combination.
 *
 * @returns {number} The number of occurrences.
 */
WordCombination.prototype.getOccurrences = function() {
	return this._occurrences;
};

/**
 * Increments the occurrences.
 *
 * @returns {void}
 */
WordCombination.prototype.incrementOccurrences = function() {
	this._occurrences += 1;
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

/**
 * Serializes the WordCombination instance to an object.
 *
 * @returns {Object} The serialized WordCombination.
 */
WordCombination.prototype.serialize = function() {
	return {
		_parseClass: "WordCombination",
		word: this._word,
		stem: this._stem,
		occurrences: this._occurrences,
	};
};

/**
 * Parses the object to a WordCombination.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {WordCombination} The parsed WordCombination.
 */
WordCombination.parse = function( serialized ) {
	return new WordCombination( serialized.word, serialized.stem, serialized.occurrences );
};

export default WordCombination;
