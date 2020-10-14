import { MODAL_DISMISS, MODAL_OPEN, MODAL_OPEN_NO_KEYPHRASE } from "../actions";

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
function SEMrushModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case MODAL_OPEN_NO_KEYPHRASE:
			return {
				whichModalOpen: "none",
				displayNoKeyphraseMessage: true,
			};
		case MODAL_OPEN:
			return {
				whichModalOpen: action.location,
				displayNoKeyphraseMessage: false,
			};
		case MODAL_DISMISS:
			return {
				whichModalOpen: "none",
				displayNoKeyphraseMessage: false,
			};
	}
	return state;
}

export default SEMrushModalReducer;
