import { replace } from "lodash";

/**
 * Convert name to id with only chars
 * @param {string} name Name to convert to id.
 * @param {string} [prefix] Prefix for id.
 * @returns {string} Id from name.
 */
export const convertNameToId = ( name, prefix = "field" ) => `${prefix ? `${prefix}-` : ""}${replace( name, ".", "-" )}`;
