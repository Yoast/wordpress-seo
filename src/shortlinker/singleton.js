import Shortlinker from "./Shortlinker";

let shortlinker = null;

/**
 * Retrieves the Shortlinker instance.
 *
 * @returns {Shortlinker} The Shortlinker.
 */
export function getShortlinker() {
	if ( shortlinker === null ) {
		shortlinker = new Shortlinker();
	}
	return shortlinker;
}

/**
 * Configures the Shortlinker instance.
 *
 * @param {Object} config             The configuration.
 * @param {Object} [config.params={}] The default params to use in shortlinks.
 *
 * @returns {void}
 */
export function configureShortlinker( config ) {
	( getShortlinker() ).configure( config );
}

/**
 * Creates a shortlink using the params from the config.
 *
 * @param {string} url         The url.
 * @param {Object} [params={}] Optional extra params for in the query string.
 *
 * @returns {string} The shortlink with query string.
 */
export function createShortlink( url, params = {} ) {
	return ( getShortlinker() ).create( url, params );
}
