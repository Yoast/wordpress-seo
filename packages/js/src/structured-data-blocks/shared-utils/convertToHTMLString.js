import { renderToString } from "@wordpress/element";

/**
 * Converts an array of HTML strings or elements to a single HTML string.
 * @param {Array|string} contents The contents to convert.
 * @returns {string} The resulting HTML string.
 */
export const convertToHTMLString = ( contents ) => {
	if ( ! Array.isArray( contents ) ) {
		return contents;
	}
	return contents.map( ( item ) => {
		if ( ! item ) {
			return "";
		}

		if ( typeof item === "string" ) {
			return item;
		}
		return renderToString( item );
	} ).join( "" );
};
