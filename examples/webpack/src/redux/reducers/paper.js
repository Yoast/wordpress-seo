import {
	SET_PAPER,
} from "../actions/paper";

const INITIAL_STATE = {};

/**
 * A reducer for the paper.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function paper( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_PAPER:
			return action.paper;

		default:
			return state;
	}
}

export default paper;
