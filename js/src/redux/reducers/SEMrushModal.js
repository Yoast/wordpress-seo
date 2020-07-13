import {MODAL_CHANGE_DATABASE, MODAL_DISMISS} from "../actions/SEMrushModal";
import {MODAL_OPEN} from "../actions";

const INITIAL_STATE = {
	isModalOpen: false,
	currentDatabase: "us"
};

/**
 * A reducer for the SEMrush modal.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @return {Object}
 */
function SEMrushModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case MODAL_DISMISS:
			return {
				isModalOpen: false,
				currentDatabase: state.currentDatabase,
			};
		case MODAL_OPEN:
			return {
				isModalOpen: true,
				currentDatabase: state.currentDatabase,
			};
		case MODAL_CHANGE_DATABASE:
			return {
				isModalOpen: state.isModalOpen,
				currentDatabase: action.country,
			};
	}
	return state;
}

export default SEMrushModalReducer;
