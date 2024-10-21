import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @param {string} selector The name of the selector.
 * @param {array} [deps] List of dependencies.
 * @param {*} [args] Selector arguments.
 * @returns {*} The result.
 */
const useSelectGeneralPage = ( selector, deps = [], ...args ) => useSelect( select => select( STORE_NAME )[ selector ]?.( ...args ), deps );

export default useSelectGeneralPage;
