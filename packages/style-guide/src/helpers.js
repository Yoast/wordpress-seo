/**
 * Converts a hexadecimal color notation in a RGB notation.
 *
 * @param {string} hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 *
 * @returns {string} The color in RGB notation.
 */
function parseToRgb( hexColor ) {
	if ( typeof hexColor !== "string" ) {
		throw new Error( "Please pass a string representation of a color in hex notation." );
	}

	const hexRegex = /^#[a-fA-F0-9]{6}$/;
	const shortHexRegex = /^#[a-fA-F0-9]{3}$/;

	if ( hexColor.match( hexRegex ) ) {
		return parseInt( `${ hexColor[ 1 ] }${ hexColor[ 2 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 3 ] }${ hexColor[ 4 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 5 ] }${ hexColor[ 6 ] }`, 16 );
	}

	if ( hexColor.match( shortHexRegex ) ) {
		return parseInt( `${ hexColor[ 1 ] }${ hexColor[ 1 ] }`, 16 ) + ", " +
			parseInt( `${ hexColor[ 2 ] }${ hexColor[ 2 ] }`, 16 ) + ", " +
			parseInt( ` ${ hexColor[ 3 ] }${ hexColor[ 3 ] }`, 16 );
	}

	throw new Error( "Couldn't parse the color string. Please provide the color as a string in hex notation." );
}

/**
 * Returns a CSS color in RGBA format.
 *
 * @param {string}        hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 * @param {string|number} alpha    The alpha opacity value for the color, in a range from 0.0 to 1.0.
 *
 * @returns {string} The CSS color formatted as a RGBA value.
 */
export function rgba( hexColor, alpha ) {
	return "rgba( " + parseToRgb( hexColor ) + ", " + alpha + " )";
}
