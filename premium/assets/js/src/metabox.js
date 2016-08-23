/* global jQuery */

import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";

var focusKeywordSuggestions = new FocusKeywordSuggestions();

/**
 * Initializes the metabox for premium
 *
 * @returns {void}
 */
function initializeDOM() {
	focusKeywordSuggestions.initializeDOM();
}

jQuery( initializeDOM );
