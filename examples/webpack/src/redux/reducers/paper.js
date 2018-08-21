import * as actions from "../actions/paper";

const INITIAL_STATE = {};

/**
 * A reducer for the paper.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function paper( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case actions.SET_PAPER:
			return action.paper;

		case actions.SET_PAPER_ATTRIBUTE:
			return {
				...state,
				[ action.name ]: action.value,
			};

		default:
			return state;
	}
}
