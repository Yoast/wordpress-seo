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
import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
import activeKeyword from "./redux/reducers/activeKeyword";
import ContentAnalysis from "./components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "./components/contentAnalysis/SeoAnalysis";
import Data from "./analysis/data.js";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import SnippetPreviewSection from "./components/SnippetPreviewSection";

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
	} );

	return createStore( rootReducer, {}, flowRight( enhancers ) );
}

/**
 * Wraps a component in the required top level components.
 *
 * @param {ReactElement} Component The component to be wrapped.
 * @param {Object} store Redux store.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInTopLevelComponents( Component, store ) {
	return (
		<IntlProvider
			messages={ localizedData.intl } >
			<Provider store={ store } >
				<Component hideMarksButtons={ localizedData.show_markers !== "1" } />
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
	if( targetElement ) {
		ReactDOM.render(
			wrapInTopLevelComponents( component, store ),
			targetElement
		);
	}
}

/**
 * Renders the snippet preview for display.
 *
 * @param {Object} store Redux store.
 *
 * @returns {void}
 */
function renderSnippetPreview( store ) {
	const targetElement = document.getElementById( "wpseosnippet" );

	if ( ! targetElement ) {
		return;
	}

	const container = document.createElement( "div" );
	targetElement.parentNode.insertBefore( container, targetElement );

	ReactDOM.render(
		wrapInTopLevelComponents( SnippetPreviewSection, store ),
		container,
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
	renderReactApp( args.readabilityTarget, ContentAnalysis, store );
	renderReactApp( args.seoTarget, SeoAnalysis, store );
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
	let data = {};

	// Only use Gutenberg's data if Gutenberg is available.
	if ( isGutenbergDataAvailable() ) {
		const gutenbergData = new Data( wp.data, args.onRefreshRequest );
		gutenbergData.subscribeToGutenberg();
		data = gutenbergData;
	}

	renderReactApps( store, args );

	if ( args.shouldRenderSnippetPreview ) {
		renderSnippetPreview( store );
	}

	return {
		store,
		data,
	};
}

export default initialize;
