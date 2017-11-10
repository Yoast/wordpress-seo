/* global wpseoPostScraperL10n */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
import activeKeyword from "./redux/reducers/activeKeyword";
import ContentAnalysis from "./components/contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "./components/contentAnalysis/SeoAnalysis";

/**
 * This should be the entry point for all the edit screens. Because of backwards compatibility we can't change this at once.
 */



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
 * Render the react apps.
 *
 * @param {Object} store Redux store.
 * @param {Object} args Arguments.
 *
 * @returns {void}
 */
function renderReactApps( store, args ) {
	const contentAnalysisElement = document.getElementById( args.readabilityTarget );
	const seoAnalysisElement = document.getElementById( args.seoTarget );

	if( window.wpseoPostScraperL10n.intl ) {
		// Add react-intl translations
		addLocaleData( wpseoHelpCenterData.translations );
	}

	ReactDOM.render(
		wrapInTopLevelComponents( ContentAnalysis, store ),
		contentAnalysisElement
	);

	ReactDOM.render(
		wrapInTopLevelComponents( SeoAnalysis, store ),
		seoAnalysisElement
	);
}

/**
 * Wrap a component in the required top level components.
 *
 * @param {ReactElement} Component The component to be wrapped.
 * @param {Object} store Redux store.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInTopLevelComponents( Component, store ) {
	return (
		<IntlProvider
			locale={ window.wpseoPostScraperL10n.intl.locale }
			messages={ window.wpseoPostScraperL10n.intl } >
			<Provider store={ store } >
				<Component />
			</Provider>
		</IntlProvider>
	);
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
 * @returns {Object} things that need to be exposed, such as the store.
 */
export function initialize( args ) {
	const store = configureStore();

	renderReactApps( store, args );

	return {
		store,
	};
}

export default initialize;
