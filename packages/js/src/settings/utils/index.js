import { filter, isArray, isObject, join, reduce } from "lodash";

/**
 * Determines if the given value should flatten.
 * @param {*} value The value.
 * @returns {boolean} True if the value is an object or an array.
 */
const shouldFlatten = value => isObject( value ) || isArray( value );

/**
 * Flattens nested object to a single level. Props will be keyed by dot syntax path.
 * @param {Object} object The object to flatten.
 * @param {string} parentPath The parent object path.
 * @param {function} getShouldFlatten Determines whether the entry should be flattened.
 * @returns {Object} Flattened object.
 */
export const flattenObject = ( object, parentPath = "", getShouldFlatten = shouldFlatten ) => reduce(
	object,
	( acc, value, key ) => {
		const flatKey = join( filter( [ parentPath, key ], Boolean ), "." );

		return getShouldFlatten( value, key ) ? {
			...acc,
			...flattenObject( value, flatKey, getShouldFlatten ),
		} : {
			...acc,
			[ flatKey ]: value,
		};
	},
	{}
);
