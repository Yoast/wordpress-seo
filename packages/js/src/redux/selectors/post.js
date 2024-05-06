import { get } from "lodash";

/**
 * @param {Ojbect} state The current Redux state.
 * @returns {number} The post ID.
 */
export const getPostId = ( state ) => get( state, "post.id", null );

/**
 * @param {Ojbect} state The current Redux state.
 * @returns {string} Is post or term.
 */
export const getIsPost = ( state ) => get( state, "post.isPost", null );

/**
 * @param {Ojbect} state The current Redux state.
 * @returns {string} Post type.
 */
export const getPostType = ( state ) => get( state, "post.type", null );

/**
 * @param {Ojbect} state The current Redux state.
 * @returns {object} Post taxonomies.
 */
export const getPostTaxonomies = ( state ) => get( state, "post.taxonomies", null );
