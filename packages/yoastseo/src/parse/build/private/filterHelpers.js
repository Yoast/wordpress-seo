/**
 * Filter helpers for the html tree filter.
 * All helpers are functions that return a callback with the element as the only argument.
 */


/**
 * Creates a callback that checks if an element has a specific name.
 *
 * @param {string} name The name to check.
 *
 * @returns {function(*)} A function that returns true if the element has a specific name.
 */
export function elementHasName( name ) {
	return ( element ) => {
		return element.name === name;
	};
}

/**
 * Creates a callback that checks the class of an element.
 *
 * @param {string} className The classname to filter out.
 *
 * @returns {function(*): boolean} A function that returns true if a Node has a certain class.
 */
export function elementHasClass( className ) {
	return ( blockElement ) => {
		return !! blockElement.attributes.class && blockElement.attributes.class.has( className );
	};
}

/**
 * Creates a callback that checks if an element has a certain ID.
 *
 * @param {string} id The ID we want to check against.
 *
 * @returns {function(*): boolean}  A function that returns true if an element has a certain ID.
 */
export function elementHasID( id ) {
	return ( element ) => {
		return element.attributes.id === id;
	};
}
