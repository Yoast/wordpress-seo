import { OPEN_EDITOR_MODAL, CLOSE_EDITOR_MODAL } from "../actions";

const INITIAL_STATE = {
	openedModal: "",
};

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function editorModalsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case OPEN_EDITOR_MODAL:
			return {
				...state,
				openedModal: action.modalKey,
			};
		case CLOSE_EDITOR_MODAL:
			return {
				...state,
				openedModal: "",
			};
	}
	return state;
}

export default editorModalsReducer;
