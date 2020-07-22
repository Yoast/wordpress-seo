import { MODAL_CHANGE_DATABASE, MODAL_DISMISS, MODAL_OPEN } from "../actions";

const INITIAL_STATE = {
	whichModalOpen: "none",
	currentDatabase: "us",
};
/**
 * A reducer for the SEMrush modal.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function SEMrushModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case MODAL_DISMISS:
			return {
				whichModalOpen: "none",
				currentDatabase: state.currentDatabase,
			};
		case MODAL_OPEN:
			return {
				whichModalOpen: action.location,
				currentDatabase: state.currentDatabase,
			};
		case MODAL_CHANGE_DATABASE:
			return {
				whichModalOpen: state.whichModalOpen,
				currentDatabase: action.country,
			};
	}
	return state;
}

export default SEMrushModalReducer;
