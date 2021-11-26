import {
	WINCHER_MODAL_DISMISS,
	WINCHER_MODAL_OPEN,
	WINCHER_MODAL_OPEN_NO_KEYPHRASE,
} from "../actions";

const INITIAL_STATE = {
	whichModalOpen: "none",
	hasNoKeyphrase: false,
};
/**
 * A reducer for the Wincher modal.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function WincherModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case WINCHER_MODAL_OPEN_NO_KEYPHRASE:
			return {
				whichModalOpen: "none",
				hasNoKeyphrase: true,
			};
		case WINCHER_MODAL_OPEN:
			return {
				...state,
				hasNoKeyphrase: false,
				whichModalOpen: action.location,
			};
		case WINCHER_MODAL_DISMISS:
			return {
				...state,
				whichModalOpen: "none",
				hasNoKeyphrase: false,
			};
	}
	return state;
}

export default WincherModalReducer;
