import { MODAL_DISMISS } from "../actions/SEMrushModal";
import {MODAL_OPEN} from "../actions";

const INITIAL_STATE = {
	isModalOpen: false,
};

/**
 * A reducer for the SEMrush modal.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @return {boolean}
 */
function SEMrushModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case MODAL_DISMISS:
			return {
				isModalOpen: false,
			};
		case MODAL_OPEN:
			return {
				isModalOpen: true,
			};

	}
	return state;
}

export default SEMrushModalReducer;
