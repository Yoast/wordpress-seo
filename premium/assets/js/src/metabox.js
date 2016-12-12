/* global jQuery, wpseoPremiumMetaboxData */

import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import LinkSuggestions from "./linkSuggestions/LinkSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let take = require( "lodash/take" );

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

let numberOfLinkSuggestions = 20;

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

	linkSuggestions = new LinkSuggestions( {
		target: document.getElementById( "yoast_internal_linking" ).getElementsByClassName( "inside" )[ 0 ],
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
	} );

	linkSuggestions.initializeDOM( take( settings.linkSuggestions, numberOfLinkSuggestions ) );

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
