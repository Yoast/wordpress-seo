export const MODAL_DISMISS = "MODAL_DISMISS";
export const MODAL_OPEN = "MODAL_OPEN";
export const MODAL_CHANGE_DATABASE = "MODAL_CHANGE_DATABASE";

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
 * @param {string} location of the modal to open
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
 * Sets the country of the database in the dropdown menu.
 *
 * @param {string} country of the database to be set.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushChangeDatabase( country ) {
	return {
		type: MODAL_CHANGE_DATABASE,
		country,
	};
}
