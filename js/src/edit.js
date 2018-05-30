/* global window wpseoPostScraperL10n wpseoTermScraperL10n process wp */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import flowRight from "lodash/flowRight";

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
import SnippetPreviewSection from "./components/SnippetPreviewSection";
import documentDataReducer from "./redux/reducers/documentData";
import { setDocumentData } from "./redux/actions/documentData";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
let localizedData = { intl: {} };
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
	const middleware = [
		thunk,
	];

	if ( process.env.NODE_ENV !== "production" ) {
		middleware.push( logger );
	}

	const enhancers = [
		applyMiddleware( ...middleware ),
	];

	if ( window.__REDUX_DEVTOOLS_EXTENSION__ ) {
		enhancers.push( window.__REDUX_DEVTOOLS_EXTENSION__() );
	}

	const rootReducer = combineReducers( {
		marksButtonStatus: markerStatusReducer,
		analysis: analysis,
		activeKeyword: activeKeyword,
		activeTab,
		snippetEditor,
		documentData: documentDataReducer,
	} );

	return createStore( rootReducer, {}, flowRight( enhancers ) );
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
	return (
		<IntlProvider
			messages={ localizedData.intl } >
			<Provider store={ store } >
				<Component { ...props } />
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
 * @param {Object} store Redux store.
 * @param {Object} props Props to be passed to the snippet preview.
 * @param {string} props.baseUrl The base URL of the site the user is editing.
 * @param {string} props.date The date.
 *
 * @returns {void}
 */
function renderSnippetPreview( store, props ) {
	const targetElement = document.getElementById( "wpseosnippet" );

	if ( ! targetElement ) {
		return;
	}

	ReactDOM.render(
		wrapInTopLevelComponents( SnippetPreviewSection, store, props ),
		targetElement,
	);
}

/**
 * Renders the react apps.
 *
 * @param {Object} store Redux store.
 * @param {Object} args Arguments.
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
 * Maps the data to the correct fields in the store.
 *
 * @param {Object} data  The data object.
 * @param {Object} store The redux store.
 *
 * @returns {void}
 */
function mapDataToStore( data, store ) {
	const newData = data.getData();

	store.dispatch( setDocumentData( {
		title: newData.title,
		content: newData.content,
		excerpt: newData.excerpt,
	} ) );
}

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @param {Object} args Edit initialize arguments.
 * @param {boolean} args.shouldRenderSnippetPreview Whether the new reactified
 *                                                  snippet preview should be
 *                                                  rendered.
 * @param {string} args.seoTarget Target to render the seo analysis.
 * @param {string} args.readabilityTarget Target to render the readability analysis.
 * @param {Function} args.onRefreshRequest The function to refresh the analysis.
 *
 * @returns {Object} The store and the data.
 */
export function initialize( args ) {
	const store = configureStore();

	const data = initializeData( wp.data, args, store );
	mapDataToStore( data, store );

	renderReactApps( store, args );

	renderSnippetPreview( store, {
		baseUrl: args.snippetEditorBaseUrl,
		date: args.snippetEditorDate,
	} );

	return {
		store,
		data,
	};
}

export default initialize;
