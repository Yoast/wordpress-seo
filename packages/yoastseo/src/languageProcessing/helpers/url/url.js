const urlFromAnchorRegex = /href=(["'])([^"']+)\1/i;
import urlMethods from "url";

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
 * Retrieves the URL from an anchor tag.
 *
 * @param {string} anchorTag An anchor tag.
 * @returns {string} The URL in the anchor tag.
 */
function getFromAnchorTag( anchorTag ) {
	const urlMatch = urlFromAnchorRegex.exec( anchorTag );

	return ( urlMatch === null ) ? "" : urlMatch[ 2 ];
}

/**
 * Returns whether or not the given URLs are equal.
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
 * Returns the domain name of a URL.
 *
 * @param {string} url The URL to retrieve the domain name of.
 * @returns {string} The domain name of the URL.
 */
function getHostname( url ) {
	url = urlMethods.parse( url );

	return url.hostname;
}

/**
 * Returns the protocol of a URL.
 *
 * Note that the colon (http:) is also part of the protocol, conform to node's url.parse api.
 *
 * @param {string} url The URL to retrieve the protocol of.
 * @returns {string|null} The protocol of the URL or null if no protocol is present.
 */
function getProtocol( url ) {
	return urlMethods.parse( url ).protocol;
}

/**
 * Determine whether a URL is internal.
 *
 * @param {string} url The URL to test.
 * @param {string} host The current host.
 *
 * @returns {boolean} Whether or not the URL is internal.
 */
function isInternalLink( url, host, permalink ) {
	const parsedUrl = urlMethods.parse( url, false, true );
	// Check if the URL starts with a single slash.
	if ( url.indexOf( "//" ) === -1 && url.indexOf( "/" ) === 0 ) {
		return true;
	}

	// Check if the URL starts with a # indicating a fragment.
	if ( url.indexOf( "#" ) === 0 ) {
		return false;
	}

	// No host indicates an internal link.
	if ( ! parsedUrl.host ) {
		return true;
	}

	/*
	 * It could be that the host is null if we only have access to the site's domain, not full url (this is the case with Shopify).
	 * In that case, a permalink identical to the parsedUrl's host would also indicate an internal link.
	 */
	if ( parsedUrl.host === permalink ) {
		return true;
	}

	return parsedUrl.host === host;
}

/**
 * Checks whether the protocol is either HTTP: or HTTPS:.
 *
 * @param {string} protocol The protocol to test.
 *
 * @returns {boolean} Whether the protocol is http(s):.
 */
function protocolIsHttpScheme( protocol ) {
	if ( ! protocol ) {
		return false;
	}

	return ( protocol === "http:" || protocol === "https:" );
}

/**
 * Determines whether the link is a relative fragment URL.
 *
 * @param {string} url The URL to test.
 *
 * @returns {boolean} Whether the link is a relative fragment URL.
 */
function isRelativeFragmentURL( url ) {
	return url.indexOf( "#" ) === 0;
}

export default {
	removeHash: removeHash,
	removeQueryArgs: removeQueryArgs,
	removeTrailingSlash: removeTrailingSlash,
	addTrailingSlash: addTrailingSlash,
	getFromAnchorTag: getFromAnchorTag,
	areEqual: areEqual,
	getHostname: getHostname,
	getProtocol: getProtocol,
	isInternalLink: isInternalLink,
	protocolIsHttpScheme: protocolIsHttpScheme,
	isRelativeFragmentURL: isRelativeFragmentURL,
};
