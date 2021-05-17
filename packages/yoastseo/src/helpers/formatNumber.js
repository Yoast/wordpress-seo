/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */
export default function( number ) {
	if ( Math.round( number ) === number ) {
		return Math.round( number );
	}

	return Math.round( number * 10 ) / 10;
}
