// External dependencies.
import { save, load, clear } from "redux-localstorage-simple";

export const namespace = "YoastSEO_Example";

/**
 * Creates middleware that saves to the localstorage.
 *
 * @param {Array}  [states]   The state keys to save.
 * @param {number} [debounce] The debounce time in milliseconds.
 *
 * @returns {Middleware} The middleware.
 */
export function createStorageMiddleware( states = [], debounce = 0 ) {
	return save( {
		states,
		namespace,
		debounce,
	} );
}

/**
 * Loads the data from the localstorage.
 *
 * @param {Array}  [states]         The state keys to load.
 * @param {Object} [preloadedState] The preloaded state.
 *
 * @return {Object} The data.
 */
export function getStorageData( states = [], preloadedState = {} ) {
	return load( {
		states,
		namespace,
		preloadedState,
		disableWarnings: true,
	} );
}

/**
 * Removes the data from the localstorage.
 *
 * @returns {void}
 */
export function clearStorage() {
	clear( {
		namespace,
	} );
}
