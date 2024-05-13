import { get } from "lodash";

/**
 * @param {Ojbect} state The current Redux state.
 * @returns {number} The post ID.
 */
export const getPostId = ( state ) => get( state, "postId", null );
