/* global jQuery */
import { render } from "@wordpress/element";
import Indexation from "./components/Indexation";

const preIndexingActions = {};
const indexingActions = {};

window.yoast = window.yoast || {};
window.yoast.indexing = window.yoast.indexing || {};

let root;

/**
 * Render the component.
 *
 * @returns {void}
 */
function renderRoot() {
	if ( ! root ) {
		root = document.getElementById( "yoast-seo-indexing-action" );
	}

	if ( root ) {
		render( <Indexation
			preIndexingActions={ preIndexingActions }
			indexingActions={ indexingActions }
		/>, root );
	}
}

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerPreIndexingAction = ( endpoint, action ) => {
	preIndexingActions[ endpoint ] = action;
	renderRoot();
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @param {string}                       endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerIndexingAction = ( endpoint, action ) => {
	indexingActions[ endpoint ] = action;
	renderRoot();
};

/**
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing` instead.
 */
window.yoast.indexation = window.yoast.indexing;

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerPreIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerPreIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerPreIndexingAction' instead." );
	window.yoast.indexing.registerPreIndexingAction( endpoint, action );
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerIndexingAction' instead." );
	window.yoast.indexing.registerIndexingAction( endpoint, action );
};

jQuery( function() {
	renderRoot();
} );
