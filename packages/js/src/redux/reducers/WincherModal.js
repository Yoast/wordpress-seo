import { WINCHER_MODAL_DISMISS, WINCHER_MODAL_OPEN, WINCHER_MODAL_OPEN_NO_KEYPHRASE } from "../actions";

const INITIAL_STATE = {
	whichModalOpen: "none",
	displayNoKeyphraseMessage: false,
};
/**
 * A reducer for the SEMrush modal.
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
				displayNoKeyphraseMessage: true,
			};
		case WINCHER_MODAL_OPEN:
			return {
				whichModalOpen: action.location,
				displayNoKeyphraseMessage: false,
			};
		case WINCHER_MODAL_DISMISS:
			return {
				whichModalOpen: "none",
				displayNoKeyphraseMessage: false,
			};
	}
	return state;
}

export default WincherModalReducer;
