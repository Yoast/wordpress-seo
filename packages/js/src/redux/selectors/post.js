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
