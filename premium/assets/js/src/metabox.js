/* global jQuery, wpseoPremiumMetaboxData, YoastSEO */

import React from "react";
import { Provider } from "react-redux";
import Collapsible from "yoast-components/composites/Plugin/shared/components/Collapsible";

import {
	loadLinkSuggestions,
	setLinkSuggestions,
	setLinkSuggestionsError,
} from "./redux/actions/LinkSuggestions";
import createStore from "./redux/store";
import { renderReactApp } from "./redux/utils/render";
import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import ProminentWordNoStorage from "./keywordSuggestions/ProminentWordNoStorage";
import FocusKeywordSuggestions from "./keywordSuggestions/KeywordSuggestions";
import linkSuggester from "./services/linkSuggester";
import LinkSuggestionsContainer from "./redux/containers/LinkSuggestions";
import MultiKeyword from "./metabox/multiKeyword";
import Synonyms from "./metabox/synonyms";
import isGutenbergDataAvailable from "../../../../js/src/helpers/isGutenbergDataAvailable";
import { setTextdomainL10n, setYoastComponentsL10n } from "../../../../js/src/helpers/i18n";
import SidebarItem from "../../../../js/src/components/SidebarItem";

setTextdomainL10n( "wordpress-seo-premium" );

import reducers from "yoast-premium-components/redux/reducers";

let settings = wpseoPremiumMetaboxData.data;

let contentEndpointsAvailable = wpseoPremiumMetaboxData.data.restApi.available && wpseoPremiumMetaboxData.data.restApi.contentEndpointsAvailable;

let multiKeyword = new MultiKeyword();

let prominentWordStorage = new ProminentWordNoStorage();
let focusKeywordSuggestions;

let linkSuggestions;

let cornerstoneElementID = "yst_is_cornerstone";

let store = createStore();

setYoastComponentsL10n();

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
 * Determines whether or not the SEO Analysis is enabled.
 *
 * @returns {boolean} Whether or not the SEO Analysis is enabled.
 */
function seoAnalysisEnabled() {
	return settings.seoAnalysisEnabled;
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
 * Registers a redux store in Gutenberg.
 *
 * @returns {Object} The store.
 */
function registerStoreInGutenberg() {
	const { registerStore } = yoast._wp.data;

	return registerStore( "yoast-seo-premium/editor", {
		reducer: reducers,
	} );
}

/**
 * Initializes the metabox for premium.
 *
 * @returns {void}
 */
function initializeMetabox() {
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();

	if ( seoAnalysisEnabled() ) {
		// Set options for largest keyword distance assessment to be added in premium.
		YoastSEO.app.changeAssessorOptions( {useKeywordDistribution: true} );

		const synonyms = new Synonyms();
		synonyms.initializeDOM();
	}

	if ( insightsEnabled() || linkSuggestionsEnabled() ) {
		initializeKeywordSuggestionsMetabox();
	}

	if ( linkSuggestionsIsSupported() ) {
		initializeLinkSuggester();
		renderLinkSuggestionsMetabox();
	}

	registerStoreInGutenberg();
	registerPlugin();
}

/**
 * Registers the plugin into the gutenberg editor.
 *
 * @returns {void}
 **/
let registerPlugin = function() {
	if ( isGutenbergDataAvailable() ) {
		const { Fragment } = yoast._wp.element;
		const { registerPlugin } = wp.plugins;
		const { Fill } = wp.components;

		let LinkSuggestionsSection;

		if ( linkSuggestionsIsSupported() ) {
			LinkSuggestionsSection = <SidebarItem renderPriority={ 31 }>
				<Collapsible title="Internal linking suggestions">
					<Provider store={ store }>
						<LinkSuggestionsContainer />
					</Provider>
				</Collapsible>
			</SidebarItem>
		}

		const YoastSidebar = () => (
			<Fragment>
				<Fill name="YoastSidebar">
					<SidebarItem renderPriority={ 21 }>Multiple keywords</SidebarItem>
					{ LinkSuggestionsSection }
					<SidebarItem renderPriority={ 32 }>Prominent words</SidebarItem>
				</Fill>
			</Fragment>
		);

		registerPlugin( "yoast-seo-premium", {
			render: YoastSidebar,
		} );
	}
}

let renderLinkSuggestionsMetabox = () => {


	renderReactApp(
		document.getElementById( "yoast_internal_linking" ).getElementsByClassName( "inside" )[ 0 ],
		LinkSuggestionsContainer,
		store
	);
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
function initializeLinkSuggester() {
	let dispatch = store.dispatch.bind( store );

	dispatch( loadLinkSuggestions() );

	let storeConnector = {
		setLinkSuggestions: ( linkSuggestions, showUnindexedWarning ) => {
			dispatch( setLinkSuggestions( linkSuggestions, showUnindexedWarning ) )
		},
		setLinkSuggestionsError: ( message ) => {
			dispatch( setLinkSuggestionsError( message ) )
		},
	}

	let suggester = new linkSuggester( {
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		currentPostId: settings.postID,
		showUnindexedWarning: settings.linkSuggestionsUnindexed,
		store: storeConnector,
	} );

	let usedLinks = [];
	if ( typeof YoastSEO.app.researcher !== "undefined" ) {
		usedLinks = YoastSEO.app.researcher.getResearch( "getLinks" );
	}
	suggester.setCurrentLinkSuggestions( settings.linkSuggestions, usedLinks );

	jQuery( window ).on( "YoastSEO:numericScore", suggester.updateUsedLinks.bind( suggester ) );
	prominentWordStorage.on( "savedProminentWords", suggester.updatedProminentWords.bind( suggester ) );
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
