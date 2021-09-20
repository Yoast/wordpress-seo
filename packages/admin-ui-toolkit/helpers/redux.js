import { ASYNC_STATUS } from "../constants";

/**
 * @param {string[]} actionTypes Tuple of request, success and error action types.
 * @returns {Function} Async action reducer.
 */
export const createAsyncActionReducer = ( [ requestType, successType, errorType ] ) =>
	( state = { status: ASYNC_STATUS.idle, error: "" }, { type, payload } ) => {
		switch ( type ) {
			case requestType:
				return {
					...state,
					status: ASYNC_STATUS.loading,
					error: "",
				};
			case successType:
				return {
					...state,
					status: ASYNC_STATUS.success,
				};
			case errorType:
				return {
					...state,
					status: ASYNC_STATUS.error,
					error: payload.error,
				};
			default:
				return state;
		}
	};

/**
 * @param {Object} [state] Additional state to add to initial image state.
 * @returns {Object} Initial image state object.
 */
export const createInitialImageState = ( state = {} ) => ( {
	id: "",
	url: "",
	...state,
} );
