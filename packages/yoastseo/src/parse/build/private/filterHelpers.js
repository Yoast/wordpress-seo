/**
 * Filter helpers fort the html treefilter.
 * Are all functions that return a callback with the element as only argument.
 */

/**
 * Returns a function that returns true if the element has a specific name.
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

