export const MODAL_DISMISS = "MODAL_DISMISS";
export const MODAL_OPEN = "MODAL_OPEN";
export const MODAL_OPEN_NO_KEYPHRASE = "MODAL_OPEN_NO_KEYPHRASE";

/**
 * Dismisses the SEMrush modal.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushDismissModal() {
	return {
		type: MODAL_DISMISS,
	};
}

/**
 * Opens the SEMrush modal.
 *
 * @param {string} location The location of the modal to open
 *
 * @returns {Object} Action object.
 */
export function setSEMrushOpenModal( location ) {
	return {
		type: MODAL_OPEN,
		location,
	};
}

/**
 * Displayes the empty keyphrase message when attempting to open the SEMrush modal.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushNoKeyphraseMessage() {
	return {
		type: MODAL_OPEN_NO_KEYPHRASE,
	};
}

