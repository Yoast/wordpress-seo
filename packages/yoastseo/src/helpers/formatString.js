import { escapeRegExp } from "lodash";

/**
 * Formats a string with named parameters as defined in the given parameter mapping.
 *
 * E.g. `"Hello %par_1% and %par_2%"` plus the map `{ par_1: "world", par_2: "you!" }`
 * gives: `"Hello world and you!"`.
 *
 * @param {string} string           The string to be formatted.
 * @param {Object} formatMap        The mapping in the form of parameter - value pairs.
 * @param {string} [delimiter="%%"] The string used to delimit parameters in the to be formatted string.
 *
 * @returns {string} The formatted string.
 */
export default function( string, formatMap, delimiter = "%%" ) {
	delimiter = escapeRegExp( delimiter );
	const parameterRegex = new RegExp( `${delimiter}(.+?)${delimiter}`, "g" );
	let match;
	let formattedString = string;

	// Try to match and replace each occurrence of "%%something%%" in the string.
	while ( ( match = parameterRegex.exec( string ) ) !== null ) {
		const key = match[ 1 ];
		// Create regex from parameter (e.g. "%%key%%")
		const replaceRegex = new RegExp( `${delimiter}${ escapeRegExp( key ) }${delimiter}`, "g" );
		// Replace occurrence (if parameter exists in the format map).
		if ( key in formatMap ) {
			formattedString = formattedString.replace( replaceRegex, formatMap[ key ] );
		}
	}

	return formattedString;
}
