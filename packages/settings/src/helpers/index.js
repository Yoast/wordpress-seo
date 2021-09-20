export { default as sortComponentsByRenderPriority } from "./sort-components-by-render-priority";
export { default as withHideForOptions } from "./with-hide-for-options";

/**
 * Try to parse a string as URL.
 * @param {String} url The string url to parse
 * @returns {URL|null} URL object on succesful parse, null otherwise
 */
export const parseUrl = ( url ) => {
	try {
		return new URL( url );
	} catch ( error ) {
		return null;
	}
};

/**
 * Get a flattened array of each matching prop in object.
 * @param {string} prop Name of the prop to look for in object.
 * @param {Object} obj Object to search for prop in.
 * @returns {*[]} Array of values found by prop in object..
 */
export const flattenValuesByProp = ( prop, obj = {} ) => Object.entries( obj ).reduce( ( flatValues, [ key, val ] ) => {
	if ( typeof val === "object" ) {
		// If value is object, continue searching for nested props.
		// Syntax for reuse of flattenValuesByProp confuses this eslint rule, so disable single line.
		// eslint-disable-next-line no-unused-vars
		return [ ...flatValues, ...flattenValuesByProp( prop, val ) ];
	}
	if ( key === prop ) {
		// If key matches prop, add to flattened result.
		return [ ...flatValues, val ];
	}
	return flatValues;
}, [] );
