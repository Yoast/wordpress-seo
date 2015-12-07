/**
 * Determines the type of link.
 *
 * @param {String} text String with anchor tag.
 * @returns {String} type Linktype (other, external or internal).
 */
module.exports = function( text, url ) {
	var linkType = "other";

	//matches all links that start with http:// and https://, case insensitive and global
	if ( text.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";
		var urlMatch = text.match( url );
		if ( urlMatch !== null && urlMatch[ 0 ].length !== 0 ) {
			linkType = "internal";
		}
	}
	return linkType;
};
