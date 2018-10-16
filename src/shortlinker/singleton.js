import Shortlinker from "./Shortlinker";

// Expose global variable.
self.yoast = self.yoast || {};
self.yoast.shortlinker = null;

/**
 * Retrieves the Shortlinker instance.
 *
 * @returns {Shortlinker} The Shortlinker.
 */
function getShortlinker() {
	if ( self.yoast.shortlinker === null ) {
		self.yoast.shortlinker = new Shortlinker();
	}
	return self.yoast.shortlinker;
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

/**
 * Creates an anchor opening tag using the shortlink create.
 *
 * @param {string} url         The url.
 * @param {Object} [params={}] Optional extra params for in the query string.
 *
 * @returns {string} The anchor opening tag.
 */
export function createShortlinkAnchorOpeningTag( url, params = {} ) {
	return ( getShortlinker() ).createAnchorOpeningTag( url, params );
}
