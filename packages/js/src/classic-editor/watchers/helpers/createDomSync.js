import { debounce, get, set, isEqual } from "lodash";
import { subscribe } from "@wordpress/data";
import { SYNC_DEBOUNCE_TIME } from "./constants";

/**
 * Cache to check whether we need to update the value in the DOM.
 *
 * @type {Object}
 */
let storeCache = {};

/**
 * Creates a debounced DOM sync that subscribes to store changes and maybe updates a DOM element.
 *
 * @param {Function} selector Store selector to listen to.
 * @param {{ domGet: Function, domSet: Function }} domLens Lens for getting and setting DOM element values.
 * @param {string} [storeCacheKey] Optional key to use in the cache.
 * @returns {Function} Unsubscribe from store function.
 */
const createDomSync = ( selector, { domGet, domSet }, storeCacheKey = "" ) => subscribe( debounce( () => {
	const cacheValue = get( storeCache, storeCacheKey );
	const storeValue = selector();

	if ( isEqual( cacheValue, storeValue ) ) {
		// No store change.
		return false;
	}
	if ( isEqual( domGet(), storeValue ) ) {
		// Store change is already in DOM.
		return false;
	}
	if ( storeCacheKey ) {
		// Update cache if cache key exists.
		storeCache = set( storeCache, storeCacheKey, storeValue );
	}
	// Update DOM if store value changed.
	domSet( storeValue );
}, SYNC_DEBOUNCE_TIME ) );

export default createDomSync;
