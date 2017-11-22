/* global wpseoPostScraperL10n */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider, addLocaleData } from "react-intl";

import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
import activeKeyword from "./redux/reducers/activeKeyword";
import ContentAnalysis from "./components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "./components/contentAnalysis/SeoAnalysis";

// This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.

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

	const rootReducer = combineReducers( {
		analysis: analysis,
		activeKeyword: activeKeyword,
	} );

	return createStore( rootReducer, {}, applyMiddleware( ...middleware ) );
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
			locale={ wpseoPostScraperL10n.intl.locale }
			messages={ wpseoPostScraperL10n.intl } >
			<Provider store={ store } >
				<Component />
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
 * Renders the react apps.
 *
 * @param {Object} store Redux store.
 * @param {Object} args Arguments.
 *
 * @returns {void}
 */
function renderReactApps( store, args ) {
	if ( window.wpseoPostScraperL10n.intl ) {
		// Add react-intl translations
		addLocaleData( window.wpseoPostScraperL10n.intl );
	}

	renderReactApp( args.readabilityTarget, ContentAnalysis, store );
	renderReactApp( args.seoTarget, SeoAnalysis, store );
}

/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @param {Object} args Edit initialize arguments.
 * @param {string} args.seoTarget Target to render the seo analysis.
 * @param {string} args.readabilityTarget Target to render the readability analysis.
 *
 * @returns {Object} Things that need to be exposed, such as the store.
 */
export function initialize( args ) {
	const store = configureStore();

	renderReactApps( store, args );

	return {
		store,
	};
}

export default initialize;
