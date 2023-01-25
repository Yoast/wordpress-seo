export const OPEN_EDITOR_MODAL = "OPEN_MODAL";
export const CLOSE_EDITOR_MODAL = "CLOSE_MODAL";

/**
 * Opens a modal by setting its key in the store.
 *
 * @param {string} modalKey The key that identifies the modal that should be opened.
 *
 * @returns {Object} The OPEN_EDITOR_MODAL action.
 */
export function openEditorModal( modalKey ) {
	return {
		type: OPEN_EDITOR_MODAL,
		modalKey,
	};
}

/**
 * Closes any editor modal.
 *
 * @returns {Object} The CLOSE_EDITOR_MODAL action.
 */
export function closeEditorModal() {
	return {
		type: CLOSE_EDITOR_MODAL,
	};
}
