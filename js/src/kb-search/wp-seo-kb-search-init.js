/* global wpseoAdminL10n */

import React from "react";
import ReactDom from "react-dom";
import AlgoliaSearcher from "./wp-seo-kb-search.js";

/**
 * Gets the translations for the AlgoliaSearcher from the wpseoAdminL10n global and returns them in a properties array.
 *
 * @returns {{noResultsText: *, headingText: *, searchButtonText: *, searchResultsHeading: *, errorMessage: *,
 *            loadingPlaceholder: *, search: *, open: *, openLabel: *, back: *, backLabel: *, iframeTitle: *}}
 *            Object containing the translated text properties for the knowledge base component.
 */
var getTranslations = () => {
	var translations = {
		noResultsText: wpseoAdminL10n.kb_no_results,
		headingText: wpseoAdminL10n.kb_heading,
		searchButtonText: wpseoAdminL10n.kb_search_button_text,
		searchResultsHeading: wpseoAdminL10n.kb_search_results_heading,
		errorMessage: wpseoAdminL10n.kb_error_message,
		loadingPlaceholder: wpseoAdminL10n.kb_loading_placeholder,
		search: wpseoAdminL10n.kb_search,
		open: wpseoAdminL10n.kb_open,
		openLabel: wpseoAdminL10n.kb_open_label,
		back: wpseoAdminL10n.kb_back,
		backLabel: wpseoAdminL10n.kb_back_label,
		iframeTitle: wpseoAdminL10n.kb_iframe_title,
	};
	return translations;
};
/**
 * Renders the the AlgoliaSearchers into their containers.
 *
 * @returns {array} The rendered AlgoliaSearchers.
 */
var renderAlgoliaSearchers = () => {
// Inject kb-search in divs with the classname of 'wpseo-kb-search'.
	var mountingPoints = jQuery( ".wpseo-kb-search" );
	var algoliaSearchers = [];
	jQuery.each( mountingPoints, ( index, mountingPoint ) => {
		var tabId = jQuery( mountingPoint ).closest( ".wpseotab" ).attr( "id" );
		var translations = getTranslations();

		algoliaSearchers.push( {
			tabName: tabId,
			algoliaSearcher: ReactDom.render( React.createElement( AlgoliaSearcher, translations ), mountingPoint ),
		} );
	} );
	return algoliaSearchers;
};

/**
 * Binds the event handlers to the AlgoliaSearchers.
 *
 * @param {array} algoliaSearchers The rendered Algolia searchers.
 *
 * @returns {void}
 */
var bindEventHandlers = ( algoliaSearchers )  => {
	// Get the used search strings from the algoliaSearcher React component for the active tab and fire an event with this data.
	jQuery( ".contact-support" ).on( "click", () => {
		var activeTabName = jQuery( ".wpseotab.active" ).attr( "id" );

		// 1st by default. (Used for the Advanced settings pages because of how the tabs were set up)
		var activeAlgoliaSearcher = algoliaSearchers[ 0 ].algoliaSearcher;

		jQuery.each( algoliaSearchers, ( key, searcher ) => {
			if ( searcher.tabName === activeTabName ) {
				activeAlgoliaSearcher = searcher.algoliaSearcher;

				// Returning false breaks the loop.
				return false;
			}
		} );
		var usedQueries = activeAlgoliaSearcher.state.usedQueries;
		jQuery( window ).trigger( "YoastSEO:ContactSupport", { usedQueries: usedQueries } );
	} );
};

/**
 *  Initializes the AlgoliaSearchers (in the knowledge base tabs).
 *
 *  @returns {void}
 */
var initializeAlgoliaSearch = () => {
	let algoliaSearchers = renderAlgoliaSearchers();
	bindEventHandlers( algoliaSearchers );
};

export default initializeAlgoliaSearch;
