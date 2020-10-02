/**
 * Parses the slug by transforming hyphens and underscores into white space.
 *
 * @param {string} slug The slug to parse
 *
 * @returns {string} The parsed slug.
 */
export default function( slug ) {
	return slug.replace( /[-_]/ig, " " );
}
