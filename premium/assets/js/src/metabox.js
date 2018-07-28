/* global jQuery, wpseoPremiumMetaboxData, YoastSEO, yoast */

import React from "react";
import { Provider } from "react-redux";
import Collapsible from "yoast-components/composites/Plugin/shared/components/Collapsible";

import {
	loadLinkSuggestions,
	setLinkSuggestions,
	setLinkSuggestionsError,
} from "./redux/actions/LinkSuggestions";
import { setProminentWords } from "yoast-components/redux/actions/insights";
import { renderReactApp } from "./redux/utils/render";
import ProminentWordStorage from "./keywordSuggestions/ProminentWordStorage";
import ProminentWordNoStorage from "./keywordSuggestions/ProminentWordNoStorage";
import RelevantWordsSuggester from "./keywordSuggestions/RelevantWordsSuggester";
import LinkSuggester from "./services/linkSuggester";
import LinkSuggestionsContainer from "./redux/containers/LinkSuggestions";
import RelevantWordsContainer from "./redux/containers/RelevantWords";
import MultiKeyword from "./metabox/multiKeyword";
import Synonyms from "./metabox/synonyms";
import isGutenbergDataAvailable from "../../../../js/src/helpers/isGutenbergDataAvailable";
import { setTextdomainL10n, setYoastComponentsL10n } from "../../../../js/src/helpers/i18n";
import SidebarItem from "../../../../js/src/components/SidebarItem";

setTextdomainL10n( "wordpress-seo-premium" );

import reducers from "./redux/reducers/rootReducer";

let settings = wpseoPremiumMetaboxData.data;

let contentEndpointsAvailable = wpseoPremiumMetaboxData.data.restApi.available && wpseoPremiumMetaboxData.data.restApi.contentEndpointsAvailable;

let prominentWordStorage = new ProminentWordNoStorage();
let focusKeywordSuggestions;

let linkSuggestions;

let cornerstoneElementID = "yst_is_cornerstone";

setYoastComponentsL10n();

/**
 * Determines whether or not Insights is enabled.
 *
 * @returns {boolean} Whether or not Insights is enabled.
 */
const insightsEnabled = function() {
	return settings.insightsEnabled === "enabled";
};

/**
 * Determines whether or not link suggestions are enabled.
 *
 * @returns {boolean} Whether or not link suggestions are enabled.
 */
const linkSuggestionsEnabled = function() {
	return settings.linkSuggestionsEnabled === "enabled" && settings.linkSuggestionsAvailable;
};

/**
 * Determines whether or not the SEO Analysis is enabled.
 *
 * @returns {boolean} Whether or not the SEO Analysis is enabled.
 */
const seoAnalysisEnabled = function() {
	return settings.seoAnalysisEnabled;
};

/**
 * Determines whether or not link suggestions is supported.
 *
 * @returns {boolean} Whether or not link suggestions is supported.
 */
const linkSuggestionsIsSupported = function() {
	return contentEndpointsAvailable && linkSuggestionsEnabled();
};

/**
 * Registers a redux store in Gutenberg.
 *
 * @returns {Object} The store.
 */
const registerStoreInGutenberg = function() {
	const { registerStore } = yoast._wp.data;

	return registerStore( "yoast-seo-premium/editor", {
		reducer: reducers,
	} );
};

/**
 * Initializes the metabox for premium.
 *
 * @returns {void}
 */
const initializeMetabox = function() {
	const store = registerStoreInGutenberg();

	let multiKeyword = new MultiKeyword( { store } );
	window.YoastSEO.multiKeyword = true;
	multiKeyword.initDOM();


	if ( seoAnalysisEnabled() ) {
		// Set options for largest keyword distance assessment to be added in premium.
		YoastSEO.app.changeAssessorOptions( { useKeywordDistribution: true } );

		const synonyms = new Synonyms( { premiumStore: store } );
		synonyms.initializeDOM();
	}

	if ( insightsEnabled() || linkSuggestionsEnabled() ) {
		initializeRelevantWordsSuggester( store );
	}

	if ( linkSuggestionsIsSupported() ) {
		initializeLinkSuggester( store );
		renderLinkSuggestionsMetabox( store );
	}
	registerPlugin( store );
};

/**
 * Registers the plugin into the gutenberg editor.
 *
 * @param {Object} store The premium store.
 *
 * @returns {void}
 **/
const registerPlugin = function( store ) {
	if ( isGutenbergDataAvailable() ) {
		const { Fragment } = yoast._wp.element;
		const { registerPlugin } = wp.plugins;
		const { Fill } = wp.components;

		let LinkSuggestionsSection = null;
		let InsightsSection = null;

		if ( linkSuggestionsIsSupported() ) {
			LinkSuggestionsSection = <SidebarItem renderPriority={ 31 }>
				<Collapsible title="Internal linking suggestions">
					<Provider store={ store }>
						<LinkSuggestionsContainer />
					</Provider>
				</Collapsible>
			</SidebarItem>;
		}

		if ( insightsEnabled() ) {
			InsightsSection = <SidebarItem renderPriority={ 32 }>
				<Collapsible title="Insights">
					<Provider store={ store }>
						<RelevantWordsContainer />
					</Provider>
				</Collapsible>
			</SidebarItem>;
		}

		const YoastSidebar = () => (
			<Fragment>
				<Fill name="YoastSidebar">
					<SidebarItem renderPriority={ 21 }>Multiple keywords</SidebarItem>
					{ LinkSuggestionsSection }
					{ InsightsSection }
				</Fill>
			</Fragment>
		);

		registerPlugin( "yoast-seo-premium", {
			render: YoastSidebar,
		} );
	}
};

const renderLinkSuggestionsMetabox = ( store ) => {
	renderReactApp(
		document.getElementById( "yoast_internal_linking" ).getElementsByClassName( "inside" )[ 0 ],
		LinkSuggestionsContainer,
		store
	);
};

/**
 * Initializes the prominent word storage.
 *
 * @returns {void}
 */
const initializeProminentWordStorage = function() {
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
const initializeRelevantWordsSuggester = function( store ) {
	initializeProminentWordStorage();

	let dispatch = store.dispatch.bind( store );

	let updateStore = ( words ) => {
		dispatch( setProminentWords( words ) );
	};

	let relevantWordsSuggester = new RelevantWordsSuggester( {
		prominentWordStorage,
		updateStore,
		contentEndpointsAvailable,
	} );

	jQuery( window ).on( "YoastSEO:updateProminentWords", relevantWordsSuggester.updateWords.bind( relevantWordsSuggester ) );
	jQuery( window ).on( "YoastSEO:numericScore", () => { jQuery( window ).trigger( "YoastSEO:updateProminentWords" ) } );

	// Initialize prominent words watching and saving.
	relevantWordsSuggester.suggest();
};

/**
 * Initializes the metabox for link suggestions.
 *
 * @param {Object} store The premium store.
 *
 * @returns {void}
 */
const initializeLinkSuggester = function( store ) {
	let dispatch = store.dispatch.bind( store );

	dispatch( loadLinkSuggestions() );

	let storeConnector = {
		setLinkSuggestions: ( linkSuggestions, showUnindexedWarning ) => {
			dispatch( setLinkSuggestions( linkSuggestions, showUnindexedWarning ) );
		},
		setLinkSuggestionsError: ( message ) => {
			dispatch( setLinkSuggestionsError( message ) );
		},
	};

	let suggester = new LinkSuggester( {
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
};

/**
 * Initializes the metaboxes for premium
 *
 * @returns {void}
 */
const initializeDOM = function() {
	window.jQuery( window ).on( "YoastSEO:ready", () => {
		try {
			initializeMetabox();
		} catch ( caughtError ) {
			console.error( caughtError );
		}
	} );
};

/**
 * Returns 50 when cornerstone checkbox is checked, if not checked it will return 20.
 *
 * @returns {number} The prominent words limit.
 */
const getProminentWordsLimit = function() {
	if ( document.getElementById( cornerstoneElementID ) && document.getElementById( cornerstoneElementID ).checked ) {
		return 50;
	}

	return 20;
};

window.jQuery( initializeDOM );
