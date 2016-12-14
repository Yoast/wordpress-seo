/* global jQuery, wpseoPremiumMetaboxData, wpseoAdminL10n */

import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import LinkSuggestions from "./linkSuggestions/LinkSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let settings = wpseoPremiumMetaboxData.data;

let contentEndpointsAvailable = wpseoPremiumMetaboxData.data.restApi.available && wpseoPremiumMetaboxData.data.restApi.contentEndpointsAvailable;

let multiKeyword = new MultiKeyword();
let prominentWordStorage = new ProminentWordStorage( { postID: settings.postID, rootUrl: settings.restApi.root, nonce: settings.restApi.nonce } );
let focusKeywordSuggestions = new FocusKeywordSuggestions( {
	insightsEnabled: settings.insightsEnabled === "enabled",
	prominentWordStorage,
	contentEndpointsAvailable,
} );

let linkSuggestions;

/**
 * Whether the content language is supported for the link suggestions. This is explicitly not the user language.
 *
 * @returns {boolean} Whether the content language is supported.
 */
function contentLanguageSupported() {
	return wpseoAdminL10n.locale.indexOf( "en" ) === 0;
}

/**
 * Initializes the metabox for premium.
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

	if ( contentLanguageSupported() && contentEndpointsAvailable ) {
		initializeLinkSuggestionsMetabox();
	}
}

/**
 * Initializes the metabox for linksuggestions.
 *
 * @returns {void}
 */
function initializeLinkSuggestionsMetabox() {
	// Link Suggestions are not active on all post-types yet, don't assume the element is present.
	let container = document.getElementById( "yoast_internal_linking" );
	if ( ! container ) {
		return;
	}

	linkSuggestions = new LinkSuggestions( {
		target: container.getElementsByClassName( "inside" )[ 0 ],
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		currentPostId: settings.postID,
	} );
	linkSuggestions.initializeDOM( settings.linkSuggestions );

	prominentWordStorage.on( "savedProminentWords", linkSuggestions.updatedProminentWords.bind( linkSuggestions ) );
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
