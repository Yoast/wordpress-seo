export const SET_POST_ID = "SET_POST_ID";

/**
 * @param {number} postId The post ID.
 * @returns {Object} Action object.
 */
export const setPostId = ( postId ) => ( {
	type: SET_POST_ID,
	payload: postId,
} );
