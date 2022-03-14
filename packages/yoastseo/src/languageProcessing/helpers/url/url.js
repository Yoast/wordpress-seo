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
 * Determine whether an anchor URL is internal.
 *
 * @param {string} anchorUrl 		The anchor URL to test.
 * @param {string} siteUrlOrDomain  The current site's URL or domain.
 *
 * @returns {boolean} Whether or not the anchor URL is internal.
 */
function isInternalLink( anchorUrl, siteUrlOrDomain ) {
	const parsedAnchorUrl = urlMethods.parse( anchorUrl, false, true );
	const anchorUrlHostName = parsedAnchorUrl.hostname;

	// Check if the anchor URL starts with a single slash.
	if ( anchorUrl.indexOf( "//" ) === -1 && anchorUrl.indexOf( "/" ) === 0 ) {
		return true;
	}

	// Check if the anchor URL starts with a # indicating a fragment.
	if ( anchorUrl.indexOf( "#" ) === 0 ) {
		return false;
	}

	// No host of the anchor URL indicates an internal link.
	if ( ! anchorUrlHostName ) {
		return true;
	}

	// If the siteUrlOrDomain variable is a domain, it would be idential to the anchor URL's hostname in case of an internal link.
	if ( anchorUrlHostName === siteUrlOrDomain ) {
		return true;
	}

	// If the siteUrlOrDomain variable is a URL and it shares the hostname with the anchor URL, it's an internal link.
	const parsedSiteUrlOrDomain = urlMethods.parse( siteUrlOrDomain );
	const siteUrlOrDomainHostName = parsedSiteUrlOrDomain.hostname;
	return anchorUrlHostName === siteUrlOrDomainHostName;
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
