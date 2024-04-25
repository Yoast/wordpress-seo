import { get } from "lodash";

/**
 * @param {Object} state The current Redux state.
 * @returns {?number} The post ID.
 */
export const getPostId = ( state ) => get( state, "postId", null );
