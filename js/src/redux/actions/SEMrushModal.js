export const MODAL_DISMISS = "MODAL_DISMISS";
export const MODAL_CHANGE_DATABASE = "MODAL_CHANGE_DATABASE";

/**
 * Dismisses the SEMrush modal.
 *
 * @param {Object} The modal to be dismissed.
 *
 * @returns {Object} Action object.
 */
export function SEMrushDismissModal( modal ) {
	return {
		type: MODAL_DISMISS,
		modal,
	};
}

/**
 * Sets the country of the database in the dropdown menu.
 *
 * @param {string} the country of the database to be set.
 *
 * @returns {Object} Action object.
 */
export function SEMrushChangeDatabase( country ) {
	return {
		type: MODAL_CHANGE_DATABASE,
		country,
	};
}
