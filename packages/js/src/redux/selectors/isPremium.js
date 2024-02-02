import { get } from "lodash";

/**
 * @param {Object} state    The current Redux state.
 *
 * @returns {Boolean}       Whether the plugin is Premium or not.
 */
export const getIsPremium = ( state ) => get( state, "isPremium", false );
