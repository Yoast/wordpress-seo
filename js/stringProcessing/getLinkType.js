/** @module stringProcess/getLinkType */

var urlHelper = require( "./url" );

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	var linkType = "other";

	var anchorUrl = urlHelper.getFromAnchorTag( text );

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( anchorUrl.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";

		if ( urlHelper.getHostname( anchorUrl ) === urlHelper.getHostname( url ) ) {
			linkType = "internal";
		}
	}

	return linkType;
};
