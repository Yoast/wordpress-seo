/* global jQuery, wpseoPremiumMetaboxL10n, yoastLinkSuggestions */

import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import LinkSuggestions from "./linkSuggestions/LinkSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let settings = wpseoPremiumMetaboxData;

let multiKeyword = new MultiKeyword();
let prominentWordStorage = new ProminentWordStorage( { postID: settings.postID, rootUrl: settings.restApi.root, nonce: settings.restApi.nonce } );
let focusKeywordSuggestions = new FocusKeywordSuggestions( {
	insightsEnabled: settings.insightsEnabled === "enabled",
	prominentWordStorage,
} );


/**
 * Initializes the metabox for premium
 *
 * @returns {void}
 */
function initializeMetabox() {
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();

	// Initialize prominent words watching and saving.
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
