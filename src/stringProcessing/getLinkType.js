/** @module stringProcess/getLinkType */

const urlHelper = require( "./url" );

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	let linkType = "other";

	const anchorUrl = urlHelper.getFromAnchorTag( text );
	const protocol = urlHelper.getProtocol( anchorUrl );

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( protocol === "http://" || protocol === "https://" ) {
		linkType = "external";

		if ( urlHelper.getHostname( anchorUrl ) === urlHelper.getHostname( url ) ) {
			linkType = "internal";
		}
	} else if ( protocol === null && anchorUrl.charAt( 0 ) !== "#" ) {
		linkType = "internal";
	}

	return linkType;
};
