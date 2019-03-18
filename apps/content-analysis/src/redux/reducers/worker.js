import { SET_STATUS, SET_AUTOMATIC_REFRESH } from "../actions/worker";

const defaultState = {
	status: "idling",
	isAutomaticRefreshEnabled: true,
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
				...state,
				status: action.status,
			};

		case SET_AUTOMATIC_REFRESH:
			return {
				...state,
				isAutomaticRefreshEnabled: action.enabled,
			};
	}

	return state;
}
