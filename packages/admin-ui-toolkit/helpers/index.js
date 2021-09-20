import { concat, forEach, isArray, isObject, isPlainObject, merge, mergeWith, reduce, set } from "lodash";
import { nanoid } from "nanoid";

import { ASYNC_STATUS } from "../constants";

export { default as withImagePicker } from "./with-image-picker";

export * from "./get-error-props";
export * from "./get-schema-types";
export * from "./test-helpers";
export * from "./redux";
export * from "./separators";
export * from "./replacevars";
export { default as setLocaleData } from "./set-locale-data";

/**
 * Check if async status is idle
 * @param {string} status The status to check.
 * @returns {boolean} Wether status is idle or not.
 */
export const isIdleStatus = ( status ) => status === ASYNC_STATUS.idle;
/**
 * Check if async status is loading
 * @param {string} status The status to check.
 * @returns {boolean} Wether status is loading or not.
 */
export const isLoadingStatus = ( status ) => status === ASYNC_STATUS.loading;
/**
 * Check if async status is error
 * @param {string} status The status to check.
 * @returns {boolean} Wether status is error or not.
 */
export const isErrorStatus = ( status ) => status === ASYNC_STATUS.error;
/**
 * Check if async status is success
 * @param {string} status The status to check.
 * @returns {boolean} Wether status is success or not.
 */
export const isSuccessStatus = ( status ) => status === ASYNC_STATUS.success;

/**
 * Get a validated array of content type options.
 * @param {Object} contentTypes Object with content type options keyed by their slug.
 *
 * @returns {Object} Validated object of content type options.
 */
export const getValidContentTypes = ( contentTypes ) => {
	if ( ! isObject( contentTypes ) ) {
		console.warn( "Invalid content types. Please provide an object of content types keyed by their slug to the initialize function." );
		return {};
	}

	const validContentTypes = {};

	forEach( contentTypes, ( contentType, key ) => {
		const isValid = Boolean( contentType.slug && contentType.label && contentType.slug === key );
		if ( isValid ) {
			validContentTypes[ key ] = { ...contentType };
		} else {
			console.warn( "Invalid content type and ignored: Please provide atleast a slug and label for each content type and make sure the slug matches the key." );
		}
	} );

	return validContentTypes;
};

/**
 * Perform a deep merge of at least 2 objects and replace all array prop with the latter objects array prop.
 * This is needed because the standard lodash merge also tries to merge arrays, when sometimes you just want the array replaced entirely.
 * @param {Object} targetObject Object to merge src objects into.
 * @param  {...Object} srcObjects Object to merge into target object.
 * @returns {Object} Merged object.
 */
export const mergeWithArrayReplace = ( targetObject, ...srcObjects ) => mergeWith(
	{},
	targetObject,
	...srcObjects,
	( _, newValue ) => {
		if ( isArray( newValue ) ) {
			return newValue;
		}
	},
);

/**
 * Creates a new object from a state object with the path/value merged into it. Optionally using array replace.
 *
 * This is a helper for the reducers.
 *
 * @param {Object} state The state.
 * @param {string} path Path of the value.
 * @param {*} value The value to merge.
 * @param {Object} mergeOptions Merge options.
 * @param {Object} mergeOptions.arrayMerge Set to `replace` to replace arrays when merging.
 *
 * @returns {Object} A new state.
 */
export function mergePathToState( state, path, value, mergeOptions = {} ) {
	const pathObject = set( {}, path, value );
	const mergeFn = mergeOptions.arrayMerge === "replace" ? mergeWithArrayReplace : merge;
	return mergeFn( {}, state, pathObject );
}

/**
 * Get an array with only the deepest nested values of supplied object.
 * Please note that object keys need to be unique and duplicates will be overwritten by this function.
 * @param {Object} object Object to get values for.
 * @returns {Array} Only the deepest nested values.
 */
export const getDeepestObjectValues = ( object ) => reduce( object, ( acc, value ) => {
	if ( isPlainObject( value ) ) {
		return concat( acc, getDeepestObjectValues( value ) );
	}
	return concat( acc, value );
}, [] );

/**
 * Adds a unique id prop to an object. Handy for adding unique React key props, ie. array.map( withId )
 * @param {Object} object The object to add id prop to.
 * @returns {Object} The object with added unique id prop.
 */
export const withId = ( object ) => ( {
	...object,
	id: nanoid(),
} );
