import QueryStringAppender from "./QueryStringAppender";

// Expose global variable.
self.yoast = self.yoast || {};
self.yoast.queryStringAppender = null;

/**
 * Retrieves the QueryStringAppender instance.
 *
 * @returns {QueryStringAppender} The QueryStringAppender.
 */
function getQueryStringAppender() {
	if ( self.yoast.queryStringAppender === null ) {
		self.yoast.queryStringAppender = new QueryStringAppender();
	}
	return self.yoast.queryStringAppender;
}

/**
 * Configures the QueryStringAppender instance.
 *
 * @param {Object} config             The configuration.
 * @param {Object} [config.params={}] The default params for in the url.
 *
 * @returns {void}
 */
export function configureQueryStringAppender( config ) {
	( getQueryStringAppender() ).configure( config );
}

/**
 * Creates a link by combining the params from the config and appending them to the url.
 *
 * @param {string} url         The url.
 * @param {Object} [params={}] Optional extra params for in the url.
 *
 * @returns {string} The url with query string.
 */
export function appendQueryString( url, params = {} ) {
	return ( getQueryStringAppender() ).append( url, params );
}

/**
 * Creates an anchor opening tag; uses the append function to create the url.
 *
 * @param {string} url         The url.
 * @param {Object} [params={}] Optional extra params for in the url.
 *
 * @returns {string} The anchor opening tag.
 */
export function createAnchorOpeningTag( url, params = {} ) {
	return ( getQueryStringAppender() ).createAnchorOpeningTag( url, params );
}
