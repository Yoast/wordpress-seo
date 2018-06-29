/* global window wpseoPostScraperL10n wpseoTermScraperL10n process wp */

import { createStore, combineReducers } from "redux";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import IntlProvider from "./components/IntlProvider";
import markerStatusReducer from "./redux/reducers/markerButtons";
import snippetEditor from "./redux/reducers/snippetEditor";
import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
import activeKeyword from "./redux/reducers/activeKeyword";
import activeTab from "./redux/reducers/activeTab";
import AnalysisSection from "./components/contentAnalysis/AnalysisSection";
import Data from "./analysis/data.js";
import ClassicEditorData from "./analysis/classicEditorData.js";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import SnippetEditor from "./containers/SnippetEditor";
import configureEnhancers from "./redux/utils/configureEnhancers";
import analysisDataReducer from "./redux/reducers/analysisData";
import { ThemeProvider } from "styled-components";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
let localizedData = { intl: {}, isRtl: false };
if( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

/**
 * Creates a redux store.
 *
 * @returns {Object} Things that need to be exposed, such as the store.
 */
function configureStore() {
	const enhancers = configureEnhancers();

	const rootReducer = combineReducers( {
		marksButtonStatus: markerStatusReducer,
		analysis: analysis,
		activeKeyword: activeKeyword,
		activeTab,
		snippetEditor,
		analysisData: analysisDataReducer,
	} );

	return createStore( rootReducer, {}, enhancers );
}

/**
 * Wraps a component in the required top level components.
 *
 * @param {ReactElement} Component The component to be wrapped.
 * @param {Object} store Redux store.
 * @param {Object} props React props to pass to the Component.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInTopLevelComponents( Component, store, props ) {
	const theme = {
		isRtl: localizedData.isRtl,
	};

	return (
		<IntlProvider
			messages={ localizedData.intl } >
			<Provider store={ store } >
				<ThemeProvider theme={ theme }>
					<Component { ...props } />
				</ThemeProvider>
			</Provider>
		</IntlProvider>
	);
}

/**
 * Render a react app to a target element.
 *
 * @param {string} target Target element id.
 * @param {ReactElement} component The component to render.
 * @param {Object} store Redux store.
 *
 * @returns {void}
 */
function renderReactApp( target, component, store ) {
	const targetElement = document.getElementById( target );
	const props = {
		title: localizedData.analysisHeadingTitle,
		hideMarksButtons: localizedData.show_markers !== "1",
	};
	if( targetElement ) {
		ReactDOM.render(
			wrapInTopLevelComponents( component, store, props ),
			targetElement
		);
	}
}

/**
 * Renders the snippet preview for display.
 *
 * @param {Object} store                                 Redux store.
 * @param {Object} props                                 Props to be passed to
 *                                                       the snippet preview.
 * @param {string} props.baseUrl                         Base URL of the site
 *                                                       the user is editing.
 * @param {string} props.date                            The date.
 * @param {array}  props.recommendedReplacementVariables The recommended
 *                                                       replacement variables
 *                                                       for this context.
 *
 * @returns {void}
 */
function renderSnippetPreview( store, props ) {
	const targetElement = document.getElementById( "wpseosnippet" );

	if ( ! targetElement ) {
		return;
	}

	ReactDOM.render(
		wrapInTopLevelComponents( SnippetEditor, store, props ),
		targetElement,
	);
}

/**
 * Renders the react apps.
 *
 * @param {Object} store                Redux store.
 * @param {Object} args                 Arguments.
 * @param {string} args.analysisSection The target element id for the analysis
 *                                      section.
 *
 * @returns {void}
 */
function renderReactApps( store, args ) {
	renderReactApp( args.analysisSection, AnalysisSection, store );
}

/**
 * Initialize the appropriate data class.
 *
 * @param {Object}   data                   The data from the editor.
 * @param {Object}   args                   The args.
 * @param {Function} args.onRefreshRequest  The function to call on refresh request.
 * @param {Object}   args.replaceVars       The replaceVars object.
 * @param {Object}   store                  The redux store.
 *
 * @returns {Object} The instantiated data class.
 */
export function initializeData( data, args, store ) {
	// Only use Gutenberg's data if Gutenberg is available.
	if ( isGutenbergDataAvailable() ) {
		const gutenbergData = new Data( data, args.onRefreshRequest, store );
		gutenbergData.initialize( args.replaceVars );
		return gutenbergData;
	}
	const classicEditorData = new ClassicEditorData( args.onRefreshRequest, store );
	classicEditorData.initialize( args.replaceVars );
	return classicEditorData;
}

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @param {Object}   args                                 Edit initialize arguments.
 * @param {string}   args.analysisSection                 The target element id
 *                                                        for the analysis section.
 * @param {Function} args.onRefreshRequest                The function to refresh
 *                                                        the analysis.
 * @param {Object}   args.replaceVars                     The replaceVars object.
 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site
 *                                                        the user is editing.
 * @param {string}   args.snippetEditorDate               The date for the
 *                                                        snippet editor.
 * @param {array}    args.recommendedReplacementVariables The recommended
 *                                                        replacement variables
 *                                                        for this context.
 *
 * @returns {Object} The store and the data.
 */
export function initialize( args ) {
	const store = configureStore();

	const data = initializeData( wp.data, args, store );

	renderReactApps( store, args );

	renderSnippetPreview( store, {
		baseUrl: args.snippetEditorBaseUrl,
		date: args.snippetEditorDate,
		recommendedReplacementVariables: args.recommendedReplaceVars,
	} );

	return {
		store,
		data,
	};
}

export default initialize;
