import { SET_STATUS } from "../actions/worker";

const defaultState = {
	status: "idling",
};

/**
 * Worker details.
 *
 * @param {Object} state Previous state.
 * @param {Object} action Action object.
 *
 * @returns {Object} New state.
 */
export default function worker( state = defaultState, action ) {
	switch ( action.type ) {
		case SET_STATUS:
			return {
				status: action.status,
				...state,
			};
	}

	return state;
}
