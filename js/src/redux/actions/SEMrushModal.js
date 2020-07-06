export const MODAL_DISMISS = "MODAL_DISMISS";
export const MODAL_OPEN = "MODAL_OPEN";
export const MODAL_CHANGE_DATABASE = "MODAL_CHANGE_DATABASE";

/**
 * Dismisses the SEMrush modal.
 *
 * @returns {Object} Action object.
 */
export const setSEMrushDismissModal = function() {
	return {
		type: MODAL_DISMISS,
	};
}

/**
 * Opens the SEMrush modal.
 *
 * @returns {Object} Action object.
 */
export const setSEMrushOpenModal = function() {
	return {
		type: MODAL_OPEN,
	};
}

/**
 * Sets the country of the database in the dropdown menu.
 *
 * @param {string} the country of the database to be set.
 *
 * @returns {Object} Action object.
 */
export const setSEMrushChangeDatabase = function( country ) {
	return {
		type: MODAL_CHANGE_DATABASE,
		country,
	};
}
