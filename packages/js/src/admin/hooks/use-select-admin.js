import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * Wraps WP data's useSelect.
 *
 * Usage: useSelectAdmin( "selectSomething", [ rerunIfThisChanges ], argumentForTheSelectorFunction );
 *
 * @param {string} selector The name of the selector.
 * @param {array} [deps] List of dependencies.
 * @param {*} [args] Selector arguments.
 *
 * @returns {*} The result.
 */
const useSelectAdmin = ( selector, deps = [], ...args ) => useSelect( select => select( STORE_NAME )[ selector ]?.( ...args ), deps );

export default useSelectAdmin;
