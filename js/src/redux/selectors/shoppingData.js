import { get } from "lodash";

/**
 * Gets the products shopping data from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Shopping data.
 */
export const getShoppingData = state => get( state, "shoppingData", "" );
