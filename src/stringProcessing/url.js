var urlFromAnchorRegex = /href=(["'])([^"']+)\1/i;
var urlMethods = require( "url" );

/**
 * Removes a hash from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove a hash from.
 * @returns {string} The URL without the hash.
 */
function removeHash( url ) {
	return url.split( "#" )[ 0 ];
}

/**
 * Removes all query args from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove the query args from.
 * @returns {string} The URL without the query args.
 */
function removeQueryArgs( url ) {
	return url.split( "?" )[ 0 ];
}

/**
 * Removes the trailing slash of a URL.
 *
 * @param {string} url The URL to remove the trailing slash from.
 * @returns {string} A URL without a trailing slash.
 */
function removeTrailingSlash( url ) {
	return url.replace( /\/$/, "" );
}

/**
 * Adds a trailing slash to a URL if it is not present.
 *
 * @param {string} url The URL to add a trailing slash to.
 * @returns {string} A URL with a trailing slash.
 */
function addTrailingSlash( url ) {
	return removeTrailingSlash( url ) + "/";
}

/**
 * Retrieves the URL from an anchor tag
 *
 * @param {string} anchorTag An anchor tag.
 * @returns {string} The URL in the anchor tag.
 */
function getFromAnchorTag( anchorTag ) {
	var urlMatch = urlFromAnchorRegex.exec( anchorTag );

	return ( urlMatch === null ) ? "" : urlMatch[ 2 ];
}

/**
 * Returns whether or not the given URLs are equal
 *
 * @param {string} urlA The first URL to compare.
 * @param {string} urlB The second URL to compare.
 *
 * @returns {boolean} Whether or not the given URLs are equal.
 */
function areEqual( urlA, urlB ) {
	// Make sure we are comparing URLs without query arguments and hashes.
	urlA = removeQueryArgs( removeHash( urlA ) );
	urlB = removeQueryArgs( removeHash( urlB ) );

	return addTrailingSlash( urlA ) === addTrailingSlash( urlB );
}

/**
 * Returns the domain name of a URL
 *
 * @param {string} url The URL to retrieve the domain name of.
 * @returns {string} The domain name of the URL.
 */
function getHostname( url ) {
	url = urlMethods.parse( url );

	return url.hostname;
}

module.exports = {
	removeHash: removeHash,
	removeQueryArgs: removeQueryArgs,
	removeTrailingSlash: removeTrailingSlash,
	addTrailingSlash: addTrailingSlash,
	getFromAnchorTag: getFromAnchorTag,
	areEqual: areEqual,
	getHostname: getHostname,
};
