/**
 * Filter helpers for the html tree filter.
 * All helpers are functions that return a callback with the element as the only argument.
 */


/**
 * A function that returns true if the element has a specific name.
 * @param {string} name The name to check.
 * @returns {function(*)} A function that returns true if the element has a specific name.
 */
export function elementHasName( name ) {
	return ( elem ) => {
		return elem.name === name;
	};
}

/**
 * Creates a callback that checks the data type of an element that is a Yoast block.
 * The reason why we filter by the data-type attribute and not by the class attribute is that not all Yoast blocks have class attributes.
 * @param {string} blockName The Yoast block type to filter out.
 * @returns {function(*): boolean} A function that returns true if a Node has a certain attribute.
 */
export function elementHasDataType( blockName ) {
	return ( blockElement ) => {
		if ( blockElement.attributes[ "data-type" ] || blockElement.attributes[ "data-widget_type" ] ) {
			return blockElement.attributes[ "data-type" ] && blockElement.attributes[ "data-widget_type" ] === blockName;
		}
		return false;
	};
}

export function elementHasID( id ) {
	return ( elem ) => {
		return elem.attributes.id === id;
	};
}
