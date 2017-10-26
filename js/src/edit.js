import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

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
 *
 * @returns {void}
 */
function renderReactApps( store ) {
	const contentAnalysisElement = document.getElementById( "wpseo-pageanalysis" );
	const seoAnalysisElement = document.getElementById( "yoast-seo-content-analysis" );

	ReactDOM.render(
		<Provider store={ store } >
			<ContentAnalysis />
		</Provider>,
		contentAnalysisElement
	);

	ReactDOM.render(
		<Provider store={ store } >
			<SeoAnalysis />
		</Provider>,
		seoAnalysisElement
	);
}


/**
 * Initializes all functionality on the edit screen.
 *
 * This can be a post or a term edit screen.
 *
 * @returns {Object} things that need to be exposed, such as the store.
 */
export function initialize() {
	const store = configureStore();

	renderReactApps( store );

	return {
		store,
	};
}

export default initialize;
