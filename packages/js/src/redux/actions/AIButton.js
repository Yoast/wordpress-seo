export const SET_ACTIVE_AI_FIXES_BUTTON = "SET_ACTIVE_AI_FIXES_BUTTON";
export const SET_DISABLED_AI_FIXES_BUTTONS = "SET_DISABLED_AI_FIXES_BUTTONS";

/**
 * Updates the active AI fixes button id.
 * @param {string} activeAIButton The active AI fixes button id.
 * @returns {Object} An action for redux.
 */
export function setActiveAIFixesButton( activeAIButton ) {
	return {
		type: SET_ACTIVE_AI_FIXES_BUTTON,
		activeAIButton,
	};
}

/**
 * Updates the disabled AI buttons.
 * @param {Object.<string, string>} disabledAIButtons The disabled AI buttons along with their reasons.
 * @returns {Object} An action for redux.
 */
export function setDisabledAIFixesButtons( disabledAIButtons ) {
	return {
		type: SET_DISABLED_AI_FIXES_BUTTONS,
		disabledAIButtons,
	};
}
