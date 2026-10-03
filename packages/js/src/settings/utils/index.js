import { filter, isArray, isObject, join, reduce, toString, flowRight } from "lodash";

/**
 * Flattens nested object to a single level. Props will be keyed by dot syntax path.
 * @param {Object} object The object to flatten.
 * @param {string} parentPath The parent object path.
 * @returns {Object} Flattened object.
 */
export const flattenObject = ( object, parentPath = "" ) => reduce(
	object,
	( acc, value, key ) => {
		const flatKey = join( filter( [ parentPath, key ], flowRight( Boolean, toString ) ), "." );

		return isObject( value ) || isArray( value ) ? {
			...acc,
			...flattenObject( value, flatKey ),
		} : {
			...acc,
			[ flatKey ]: value,
		};
	},
	{}
);
