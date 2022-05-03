import {
	LOAD_ESTIMATED_READING_TIME,
	SET_ESTIMATED_READING_TIME,
} from "../actions/estimatedReadingTime";

const INITIAL_STATE = {
	estimatedReadingTime: 0,
};

/**
 * A reducer for the estimatedReadingTime.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function estimatedReadingTimeReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case LOAD_ESTIMATED_READING_TIME:
			// Fallthrough condition because format of LOAD_ and SET_ actions are the same.
		case SET_ESTIMATED_READING_TIME:
			return {
				...state,
				estimatedReadingTime: action.estimatedReadingTime,
			};
		default:
			return state;
	}
}

export default estimatedReadingTimeReducer;
