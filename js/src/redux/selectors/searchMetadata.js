import { get } from "lodash";

/**
 * Gets the title.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The title.
 */
export const getSearchMetadataTitle = state => get( state, "searchMetadata.title", "" );

/**
 * Gets the description.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The description.
 */
export const getSearchMetadataDescription = state => get( state, "searchMetadata.description", "" );

/**
 * Gets the keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The keyphrase.
 */
export const getSearchMetadataKeyphrase = state => get( state, "searchMetadata.keyphrase", "" );