import React from "react";

import KeywordSuggestions from "../composites/KeywordSuggestions/KeywordSuggestions";

/**
 * Sets the relevant word.
 *
 * @param {string} word The relevant word to set.
 *
 * @returns {void}
 */
const RelevantWord = function( word ) {
	this._word = word;
};

/**
 * Returns the currently set relevant word.
 *
 * @returns {string} word The set relevant word.
 */
RelevantWord.prototype.getCombination = function() {
	return this._word;
};

const relevantWords = [ new RelevantWord( "word1" ), new RelevantWord( "word2" ), new RelevantWord( "word3" ) ];

const KeywordSuggestionsWrapper = () => (
	<KeywordSuggestions relevantWords={ relevantWords } />
);

export default KeywordSuggestionsWrapper;
