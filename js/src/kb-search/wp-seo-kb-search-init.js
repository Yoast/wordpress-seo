/* global wpseoAdminL10n */

import React from "react";
import ReactDom from "react-dom";
import { AlgoliaSearcher } from "yoast-components";

/**
 * Gets the translations for the AlgoliaSearcher from the wpseoAdminL10n global and returns them in a properties array.
 *
 * @returns {{noResultsText: *, headingText: *, searchButtonText: *, searchResultsHeading: *, errorMessage: *,
 *            loadingPlaceholder: *, search: *, open: *, openLabel: *, back: *, backLabel: *, iframeTitle: *}}
 *            Object containing the translated text properties for the knowledge base component.
 */
let getTranslations = () => {
	let translations = {
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
let renderAlgoliaSearchers = () => {
// Inject kb-search in divs with the classname of 'wpseo-kb-search'.
	let mountingPoints = jQuery( ".wpseo-kb-search" );
	let algoliaSearchers = [];

	jQuery.each( mountingPoints, ( index, mountingPoint ) => {
		let tabId = jQuery( mountingPoint ).closest( ".wpseotab" ).attr( "id" );
		let translations = getTranslations();

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
let bindEventHandlers = ( algoliaSearchers )  => {
	// Get the used search strings from the algoliaSearcher React component for the active tab and fire an event with this data.
	jQuery( ".contact-support" ).on( "click", () => {
		let activeTabName = jQuery( ".wpseotab.active" ).attr( "id" );

		// 1st by default. (Used for the Advanced settings pages because of how the tabs were set up)
		let activeAlgoliaSearcher = algoliaSearchers[ 0 ].algoliaSearcher;

		jQuery.each( algoliaSearchers, ( key, searcher ) => {
			if ( searcher.tabName === activeTabName ) {
				activeAlgoliaSearcher = searcher.algoliaSearcher;

				// Returning false breaks the loop.
				return false;
			}
		} );
		let usedQueries = activeAlgoliaSearcher.state.usedQueries;
		jQuery( window ).trigger( "YoastSEO:ContactSupport", { usedQueries: usedQueries } );
	} );
};

/**
 *  Initializes the AlgoliaSearchers (in the knowledge base tabs).
 *
 *  @returns {void}
 */
let initializeAlgoliaSearch = () => {
	let algoliaSearchers = renderAlgoliaSearchers();
	bindEventHandlers( algoliaSearchers );
};

export default initializeAlgoliaSearch;
