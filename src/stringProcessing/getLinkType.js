/** @module stringProcess/getLinkType */

const urlHelper = require( "./url" );

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url URL to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	const anchorUrl = urlHelper.getFromAnchorTag( text );

	/**
	 * A link is "Other" if:
	 * - The protocol is neither null, nor http, nor https.
	 * - The link is a relative fragment URL (starts with #), because it won't navigate to another page.
	 */
	const protocol = urlHelper.getProtocol( anchorUrl );
	if ( protocol && ! urlHelper.protocolIsHttpScheme( protocol ) ||
		urlHelper.isRelativeFragmentURL( anchorUrl ) ) {
		return "other";
	}

	if ( urlHelper.isInternalLink( anchorUrl, urlHelper.getHostname( url ) ) ) {
		return "internal";
	}

	return "external";
};
