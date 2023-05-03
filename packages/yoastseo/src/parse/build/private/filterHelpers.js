/**
 * Filter helpers for the html treefilter.
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
 * Creates a callback that checks the class of an element.
 * @param {string} className The classname to filter out.
 * @returns {function(*): boolean} A function that returns true if a Node has a certain class.
 */
export function elementHasClass( className ) {
	return ( elementThing ) => {
		if ( elementThing.attributes.class ) {
			return elementThing.attributes.class.has( className );
		}
		return false;
	};
}

/**
 * Creates a callback that checks the data type of an element that is a Yoast block.
 * It is used to filter out related links blocks and siblings blocks.
 * @param {string} blockName The Yoast block type to filter out.
 * @returns {function(*): boolean} A function that returns true if a Node has a certain attribute.
 */
export function elementHasDataType( blockName ) {
	return ( elementThing ) => {
		if ( elementThing.attributes[ "data-type" ] ) {
			return elementThing.attributes[ "data-type" ] === blockName;
		}
		return false;
	};
}
