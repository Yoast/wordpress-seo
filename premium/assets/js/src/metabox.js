/* global jQuery, wpseoPremiumMetaboxData, wpseoAdminL10n */

import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import ProminentWordNoStorage from "./keywordSuggestions/ProminentWordNoStorage";
import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import LinkSuggestions from "./linkSuggestions/LinkSuggestions";
import MultiKeyword from "./metabox/multiKeyword";

let settings = wpseoPremiumMetaboxData.data;

let contentEndpointsAvailable = wpseoPremiumMetaboxData.data.restApi.available && wpseoPremiumMetaboxData.data.restApi.contentEndpointsAvailable;

let multiKeyword = new MultiKeyword();

let prominentWordStorage = new ProminentWordNoStorage();
let focusKeywordSuggestions;

let linkSuggestions;

let cornerstoneElementID = "yst_is_cornerstone";

/**
 * Determines whether or not Insights is enabled.
 *
 * @returns {boolean} Whether or not Insights is enabled.
 */
function insightsEnabled() {
	return settings.insightsEnabled === "enabled";
}

/**
 * Determines whether or not link suggestions are enabled.
 *
 * @returns {boolean} Whether or not link suggestions are enabled.
 */
function linkSuggestionsEnabled() {
	return settings.linkSuggestionsEnabled === "enabled" && settings.linkSuggestionsAvailable;
}

/**
 * Determines whether or not link suggestions is supported.
 *
 * @returns {boolean} Whether or not link suggestions is supported.
 */
let linkSuggestionsIsSupported = function() {
	return contentEndpointsAvailable && linkSuggestionsEnabled();
};
/**
 * Initializes the metabox for premium.
 *
 * @returns {void}
 */
function initializeMetabox() {
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();

	if ( insightsEnabled() || linkSuggestionsEnabled() ) {
		initializeKeywordSuggestionsMetabox();
	}

	if ( linkSuggestionsIsSupported() ) {
		initializeLinkSuggestionsMetabox();
	}
}

/**
 * Initializes the prominent word storage.
 *
 * @returns {void}
 */
let initializeProminentWordStorage = function() {
	prominentWordStorage = new ProminentWordStorage( {
		postID: settings.postID,
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		prominentWordsLimit: getProminentWordsLimit(),
	} );

	// Binds the change event listener to the cornerstone content checkbox
	window.jQuery( "#" + cornerstoneElementID ).change( () => {
		// Sets the limit based on the checkbox.
		prominentWordStorage.setProminentWordsLimit( getProminentWordsLimit() );

		// Triggers a window event to update the prominent words.
		window.jQuery( window ).trigger( "YoastSEO:updateProminentWords" );
	} );
};

/**
 * Initializes the metabox for keyword suggestions.
 *
 * @returns {void}
 */
function initializeKeywordSuggestionsMetabox() {
	initializeProminentWordStorage();

	focusKeywordSuggestions = new FocusKeywordSuggestions( {
		insightsEnabled: insightsEnabled(),
		prominentWordStorage,
		contentEndpointsAvailable,
	} );

	// Initialize prominent words watching and saving.
	focusKeywordSuggestions.initializeDOM();
}

/**
 * Initializes the metabox for linksuggestions.
 *
 * @returns {void}
 */
function initializeLinkSuggestionsMetabox() {
	linkSuggestions = new LinkSuggestions( {
		target: document.getElementById( "yoast_internal_linking" ).getElementsByClassName( "inside" )[ 0 ],
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		currentPostId: settings.postID,
		showUnindexedWarning: settings.linkSuggestionsUnindexed,
	} );

	let usedLinks = [];
	if ( typeof YoastSEO.app.researcher !== 'undefined' ) {
		usedLinks = YoastSEO.app.researcher.getResearch( "getLinks" );
	}
	linkSuggestions.initializeDOM( settings.linkSuggestions, usedLinks );
	prominentWordStorage.on( "savedProminentWords", linkSuggestions.updatedProminentWords.bind( linkSuggestions ) );
}

/**
 * Initializes the metaboxes for premium
 *
 * @returns {void}
 */
function initializeDOM() {
	window.jQuery( window ).on( "YoastSEO:ready", () => {
		try {
			initializeMetabox();
		} catch ( caughtError ) {
			console.error( caughtError );
		}
	} );
}

/**
 * Returns 50 when cornerstone checkbox is checked, if not checked it will return 20.
 *
 * @returns {number} The prominent words limit.
 */
function getProminentWordsLimit() {
	if ( document.getElementById( cornerstoneElementID ) && document.getElementById( cornerstoneElementID ).checked ) {
		return 50;
	}

	return 20;
}


window.jQuery( initializeDOM );
