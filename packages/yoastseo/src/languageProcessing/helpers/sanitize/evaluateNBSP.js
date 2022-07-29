
/**
 *
 * @param {string} text replaces the &nbsp; string with the actual no-break space (nbsp) character.
 * @returns {string} The original string but with all occurrences of nbsp replaced with the nbsp character.
 */
export default function( text ) {
	return text.split( "&nbsp;" ).join( "\u00A0" ) // Or use this: text.replace( "&nbsp;", "\u00A0" );
}
