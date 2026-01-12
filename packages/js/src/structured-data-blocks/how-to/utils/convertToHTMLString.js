import { toHTMLString } from "@wordpress/rich-text";
import { renderToString } from "@wordpress/element";

/**
 * Converts an array of contents to an HTML string.
 *
 * @param {string|[]} contents The contents to convert.
 *
 * @returns {string} The HTML string.
 */
export const convertToHTMLString = ( contents ) => {
	if ( ! Array.isArray( contents ) ) {
		return contents;
	}
	return contents.map( ( item ) => {
		if ( typeof item === "string" ) {
			return item;
		}
		// Use renderToString for the image elements as toHTMLString does not handle images correctly.
		if ( item && item.type === "img" && item.props ) {
			return renderToString( item );
		}
		// Otherwise, assume it's a RichText format object (which handles br, etc.)
		return toHTMLString( item );
	} ).join( "" );
};
