/* global jQuery, wpseoPremiumMetaboxL10n, yoastLinkSuggestions */

import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import LinkSuggestions from "./linkSuggestions/LinkSuggestions";
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

	LinkSuggestions( yoastLinkSuggestions.suggestions, document.getElementById( 'yoast_internal_linking' ).getElementsByClassName( 'inside' )[0]);
}

/**
 * Initializes the metaboxes for premium
 *
 * @returns {void}
 */
function initializeDOM() {
	window.jQuery( window ).on( "YoastSEO:ready", initializeMetabox );
}

window.jQuery( initializeDOM );
