import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * Retrieves results from the support store via useSelect.
 *
 * This is a shorthand for calling useSelect( STORE_NAME ).
 *
 * @param {string} selector The name of the selector.
 * @param {array} [deps] List of dependencies.
 * @param {*} [args] Selector arguments.
 *
 * @returns {*} The result.
 */
export const useSelectSupport = ( selector, deps = [], ...args ) => {
	// Select from the store, and call the selector with the passed arguments.
	return useSelect( select => select( STORE_NAME )[ selector ]?.( ...args ), deps );
};
