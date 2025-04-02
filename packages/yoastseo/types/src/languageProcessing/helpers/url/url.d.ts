declare namespace _default {
    export { removeHash };
    export { removeQueryArgs };
    export { removeTrailingSlash };
    export { addTrailingSlash };
    export { getFromAnchorTag };
    export { areEqual };
    export { getHostname };
    export { getProtocol };
    export { isInternalLink };
    export { protocolIsHttpScheme };
    export { isRelativeFragmentURL };
}
export default _default;
/**
 * Removes a hash from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove a hash from.
 * @returns {string} The URL without the hash.
 */
declare function removeHash(url: string): string;
/**
 * Removes all query args from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove the query args from.
 * @returns {string} The URL without the query args.
 */
declare function removeQueryArgs(url: string): string;
/**
 * Removes the trailing slash of a URL.
 *
 * @param {string} url The URL to remove the trailing slash from.
 * @returns {string} A URL without a trailing slash.
 */
declare function removeTrailingSlash(url: string): string;
/**
 * Adds a trailing slash to a URL if it is not present.
 *
 * @param {string} url The URL to add a trailing slash to.
 * @returns {string} A URL with a trailing slash.
 */
declare function addTrailingSlash(url: string): string;
/**
 * Retrieves the URL from an anchor tag.
 *
 * @param {string} anchorTag An anchor tag.
 * @returns {string} The URL in the anchor tag.
 */
declare function getFromAnchorTag(anchorTag: string): string;
/**
 * Returns whether or not the given URLs are equal.
 *
 * @param {string} urlA The first URL to compare.
 * @param {string} urlB The second URL to compare.
 *
 * @returns {boolean} Whether or not the given URLs are equal.
 */
declare function areEqual(urlA: string, urlB: string): boolean;
/**
 * Returns the domain name of a URL.
 *
 * @param {string} url The URL to retrieve the domain name of.
 * @returns {string} The domain name of the URL.
 */
declare function getHostname(url: string): string;
/**
 * Returns the protocol of a URL.
 *
 * Note that the colon (http:) is also part of the protocol, conform to node's url.parse api.
 *
 * @param {string} url The URL to retrieve the protocol of.
 * @returns {string|null} The protocol of the URL or null if no protocol is present.
 */
declare function getProtocol(url: string): string | null;
/**
 * Determine whether an anchor URL is internal.
 *
 * @param {string} anchorUrl 		The anchor URL to test.
 * @param {string} siteUrlOrDomain  The current site's URL or domain.
 *
 * @returns {boolean} Whether or not the anchor URL is internal.
 */
declare function isInternalLink(anchorUrl: string, siteUrlOrDomain: string): boolean;
/**
 * Checks whether the protocol is either HTTP: or HTTPS:.
 *
 * @param {string} protocol The protocol to test.
 *
 * @returns {boolean} Whether the protocol is http(s):.
 */
declare function protocolIsHttpScheme(protocol: string): boolean;
/**
 * Determines whether the link is a relative fragment URL.
 *
 * @param {string} url The URL to test.
 *
 * @returns {boolean} Whether the link is a relative fragment URL.
 */
declare function isRelativeFragmentURL(url: string): boolean;
