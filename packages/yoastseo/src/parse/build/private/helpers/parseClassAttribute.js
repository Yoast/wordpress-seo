
/**
 * 
 * @param {string} classString the value of the class attribute
 * @returns A set containing all individual values of the class.
 */
export default function parseClassAttribute( classString ){
	return new Set( classString.split( ' ' ) );
}