export const SET_POST_ID = "SET_POST_ID";

/**
 * @param {number} postId The post ID.
 * @returns {{type: string, payload: number}} Action object.
 */
export const setPostId = ( postId ) => ( {
	type: SET_POST_ID,
	payload: postId,
} );
