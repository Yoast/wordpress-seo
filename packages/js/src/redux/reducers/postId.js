import { SET_POST_ID } from "../actions/postId";

/**
 * A reducer for the post ID.
 *
 * @param {boolean} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {boolean} The state.
 */
const postId = ( state = false, action ) => {
	switch ( action.type ) {
		case SET_POST_ID:
			return action.payload;
		default: return state;
	}
};

export default postId;
