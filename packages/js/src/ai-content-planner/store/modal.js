import { get } from "lodash";

export const MODAL_NAME = "modal";

const OPEN_MODAL = "OPEN_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";

const DEFAULT_STATE = {
	isOpen: false,
	skipApprove: false,
};

/**
 * Returns the initial modal state.
 *
 * @returns {Object} The initial state.
 */
export const getInitialModalState = () => ( { ...DEFAULT_STATE } );

/**
 * Reducer for the content planner modal UI state.
 *
 * @param {Object} state  The current state.
 * @param {Object} action The dispatched action.
 * @returns {Object} The new state.
 */
export const modalReducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case OPEN_MODAL:
			return { ...state, isOpen: true, skipApprove: Boolean( action.skipApprove ) };
		case CLOSE_MODAL:
			return { ...DEFAULT_STATE };
		default:
			return state;
	}
};

export const modalActions = {
	/**
	 * Opens the content planner modal.
	 *
	 * @param {boolean} [skipApprove=false] Whether to skip the approve modal step.
	 * @returns {Object} The action object.
	 */
	openModal( skipApprove = false ) {
		return { type: OPEN_MODAL, skipApprove };
	},

	/**
	 * Closes the content planner modal and resets state.
	 *
	 * @returns {Object} The action object.
	 */
	closeModal() {
		return { type: CLOSE_MODAL };
	},
};

export const modalSelectors = {
	/**
	 * Returns whether the modal is open.
	 *
	 * @param {Object} state The store state.
	 * @returns {boolean} Whether the modal is open.
	 */
	selectIsModalOpen( state ) {
		return get( state, [ MODAL_NAME, "isOpen" ], false );
	},

	/**
	 * Returns whether the approve modal step should be skipped.
	 *
	 * @param {Object} state The store state.
	 * @returns {boolean} Whether to skip the approve modal.
	 */
	selectShouldSkipApprove( state ) {
		return get( state, [ MODAL_NAME, "skipApprove" ], false );
	},
};
