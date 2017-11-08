import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";

import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";
import activeKeyword from "./redux/reducers/activeKeyword";
import ContentAnalysis from "./components/contentAnalysis/ContentAnalysis";
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

	ReactDOM.render(
		<IntlProvider>
			<Provider store={ store } >
				<ContentAnalysis />
			</Provider>
		</IntlProvider>,
		contentAnalysisElement
	);

	ReactDOM.render(
		<IntlProvider>
			<Provider store={ store } >
				<SeoAnalysis />
			</Provider>
		</IntlProvider>,
		seoAnalysisElement
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
