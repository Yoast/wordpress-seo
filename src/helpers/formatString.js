import { escapeRegExp } from "lodash-es";

/**
 * Formats a string with named parameters as defined in the given parameter mapping.
 *
 * E.g. `"Hello %par_1% and %par_2%"` plus the map `{ par_1: "world", par_2: "you!" }`
 * gives: `"Hello world and you!"`.
 *
 * @param {string} string the string to be formatted.
 * @param {Object} formatMap the mapping in the form of parameter - value pairs.
 *
 * @returns {string} the formatted string.
 */
export default function( string, formatMap ) {
	Object.keys( formatMap ).forEach( key => {
		const replaceRegex = new RegExp( `%${ escapeRegExp( key ) }%`, "g" );
		string = string.replace( replaceRegex, formatMap[ key ] );
	} );

	return string;
}
