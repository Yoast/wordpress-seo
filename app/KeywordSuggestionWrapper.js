import React from "react";

import KeywordSuggestions from "../composites/KeywordSuggestions/KeywordSuggestions";

let RelevantWord = function( word ) {
	this._word = word;
};

RelevantWord.prototype.getCombination = function() {
	return this._word;
};

const relevantWords = [ new RelevantWord( "word1" ), new RelevantWord( "word2" ), new RelevantWord( "word3" ) ];

const KeywordSuggestionsWrapper = () => (
	<KeywordSuggestions relevantWords={ relevantWords } />
);

export default KeywordSuggestionsWrapper;
