
/**
 * When splits a string of html classes into a set html classes.
 * @param {string} classString The value of the class attribute.
 * @returns {Set} A set containing all individual values of the class.
 */
export default function parseClassAttribute( classString ) {
	return new Set( classString.split( " " ) );
}
