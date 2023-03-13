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
	return ( elementThing ) => {
		return elementThing.name === name;
	};
}

/**
 * Creates a callback that checks the class of an element.
 * @param {string} className The classname to filter out.
 * @returns {function(*): boolean} A function that returns true if a Node has a certain class.
 */
export function elementHasClass( className ) {
	return ( elementThing ) => {
		if ( elementThing.attributes ) {
			return elementThing.attributes.class === className;
		}
		return false;
	};
}

/**
 * Returns a function that checks if an element is an estimatedReadingTime tag.
 * @returns {function(*): boolean} A function that returns true if a node is an estimatedReadingtime block.
 */
export function isEstimatedReadingtimetag() {
	return ( elementThing ) => {
		if ( elementThing.attributes ) {
			const className = elementThing.attributes.class;
			return className.startsWith( "yoast-reading-time" );
		}
		return false;
	};
}
