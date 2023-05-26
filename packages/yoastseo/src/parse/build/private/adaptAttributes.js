import parseClassAttribute from "./helpers/parseClassAttribute";

/**
 * @typedef Parse5Attribute
 * @property {string} name The name of the attribute.
 * @property {string} value The value of the attribute.
 */

/**
 * Adapts name-value attribute pairs as output by `parse5`
 * and transforms it into an easier to use object mapping attribute names
 * to values.
 *
 * @param {Parse5Attribute[]|null} parse5attributes The attributes as name-value pairs.
 *
 * @returns {Object} The attributes as an object mapping attribute name to value.
 */
function adaptAttributes( parse5attributes ) {
	if ( ! parse5attributes ) {
		return {};
	}

	const attributes = {};

	parse5attributes.forEach( ( { name, value } ) => {
		if ( name === "class" ) {
			value = parseClassAttribute( value );
		}
		attributes[ name ] = value;
	} );


	return attributes;
}

export default adaptAttributes;
