import { reduce, isObject } from "lodash";

/**
 * Flattens nested object to a single level. Props will be keyed by dot syntax path.
 * @param {Object} object The object to flatten.
 * @param {string} parentPath The parent object path..
 * @returns {Object} Flattened object.
 */
export const flattenObject = ( object, parentPath = "" ) => reduce(
	object,
	( acc, value, key ) => {
		if ( isObject( value ) ) {
			return flattenObject( value, key );
		}
		return {
			...acc,
			[ `${parentPath}.${key}` ]: value,
		};
	},
	{}
);
