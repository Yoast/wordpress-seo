/* global wpseoAdminL10n */

import React from "react";
import ReactDom from "react-dom";
import AlgoliaSearcher from "./wp-seo-kb-search.js";

var intialiseAlgoliaSearch = () => {
// Inject kb-search in divs with the classname of 'wpseo-kb-search'.
	var mountingPoints = jQuery( ".wpseo-kb-search" );
	var algoliaSearchers = [];
	jQuery.each( mountingPoints, function( index, mountingPoint ) {
		var tabId = jQuery( mountingPoint ).closest( ".wpseotab" ).attr( "id" );
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
		algoliaSearchers.push( {
			/* jshint ignore:start */
			tabName: tabId,
			algoliaSearcher: ReactDom.render( React.createElement( AlgoliaSearcher, translations ), mountingPoint ),
			/* jshint ignore:end */
		} );
	} );

// Get the used search strings from the algoliaSearcher React component for the active tab and fire an event with this data.
	jQuery( ".contact-support" ).on( "click", function() {
		var activeTabName = jQuery( ".wpseotab.active" ).attr( "id" );

		// 1st by default. (Used for the Advanced settings pages because of how the tabs were set up)
		var activeAlgoliaSearcher = algoliaSearchers[ 0 ].algoliaSearcher;

		jQuery.each( algoliaSearchers, function( key, searcher ) {
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

export default intialiseAlgoliaSearch;
