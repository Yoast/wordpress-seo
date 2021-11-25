export const WINCHER_MODAL_DISMISS = "WINCHER_MODAL_DISMISS";
export const WINCHER_MODAL_OPEN = "WINCHER_MODAL_OPEN";
export const WINCHER_MODAL_OPEN_NO_KEYPHRASE = "WINCHER_MODAL_OPEN_NO_KEYPHRASE";

/**
 * Dismisses the Wincher modal.
 *
 * @returns {Object} Action object.
 */
export function setWincherDismissModal() {
	return {
		type: WINCHER_MODAL_DISMISS,
	};
}

/**
 * Opens the Wincher modal.
 *
 * @param {string} location The location of the modal to open
 *
 * @returns {Object} Action object.
 */
export function setWincherOpenModal( location ) {
	return {
		type: WINCHER_MODAL_OPEN,
		location,
	};
}

/**
 * Sets the no keyphrase to true when attempting to open the Wincher modal without a keyphrase being set.
 *
 * @returns {Object} Action object.
 */
export function setWincherNoKeyphrase() {
	return {
		type: WINCHER_MODAL_OPEN_NO_KEYPHRASE,
	};
}

