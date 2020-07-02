import { MODAL_CHANGE_DATABASE, MODAL_DISMISS } from "../actions/SEMrushModal";

const INITIAL_STATE = "OPEN";

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
			state = "DISMISSED";
			let modal = action.modal;
			return {
				state,
				modal,
		};
		case MODAL_CHANGE_DATABASE:
			state = "COUNTRY_CHANGED";
			let country = action.country;
		default:
			return {
				state,
				country,
		};
	}
}

export default SEMrushModalReducer;
