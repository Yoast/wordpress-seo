/* global jQuery */

import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let multiKeyword = new MultiKeyword();
let focusKeywordSuggestions = new FocusKeywordSuggestions( multiKeyword );

/**
 * Initializes the metabox for premium
 *
 * @returns {void}
 */
function initializeMetabox() {
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();

	// The focus keyword suggestions depend on multi keyword so initialize it after multi keyword.
	focusKeywordSuggestions.initializeDOM();
}

/**
 * Initializes the metabox for premium
 *
 * @returns {void}
 */
function initializeDOM() {
	window.jQuery( window ).on( "YoastSEO:ready", initializeMetabox );
}

window.jQuery( initializeDOM );
