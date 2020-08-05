export const SET_POST_SETTINGS_MODAL_IS_OPEN = "WPSEO_POST_SETTINGS_MODAL_SET_IS_OPEN";

/**
 * Updates the post settings modal's isOpen.
 *
 * @param {boolean} isOpen Whether the post settings modal is open or not.
 *
 * @returns {Object} An action for redux.
 */
export function setPostSettingsModalIsOpen( isOpen ) {
	return {
		type: SET_POST_SETTINGS_MODAL_IS_OPEN,
		isOpen,
	};
}
