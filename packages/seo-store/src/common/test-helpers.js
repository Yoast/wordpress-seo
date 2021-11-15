import { set } from "lodash";

/**
 * Creates a function to get the store state given a reducer state.
 *
 * Handy to test selectors that need the store/global state.
 * Example:
 * ```js
 * const getStoreState = createStoreState( "form.keyphrases" );
 * const storeState = getStoreState( { focus: { keyphrase: "test" } } );
 *
 * // This will be the same as:
 * const storeState = {
 *     form: {
 *         keyphrases: {
 *             focus: {
 *                 keyphrase: "test",
 *             },
 *         },
 *     },
 * }
 * ```
 *
 * @param {string|string[]} path The path of the reducer state.
 *
 * @returns {function} The function to get the store state, given a reducer state.
 */
export const createStoreState = path => reducerState => set( {}, path, reducerState );
