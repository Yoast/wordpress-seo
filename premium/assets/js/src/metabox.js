/* global jQuery, wpseoPremiumMetaboxL10n */

import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let multiKeyword = new MultiKeyword();
let focusKeywordSuggestions = new FocusKeywordSuggestions();

let settings = wpseoPremiumMetaboxL10n;

/**
 * Initializes the metabox for premium
 *
 * @returns {void}
 */
function initializeMetabox() {
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();

	if ( settings.insightsEnabled === "enabled" ) {
		focusKeywordSuggestions.initializeDOM();
	}
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
