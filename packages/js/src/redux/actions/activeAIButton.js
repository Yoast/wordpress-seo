const PREFIX = "WPSEO_";

export const SET_ACTIVE_AI_FIXES_BUTTON = `${ PREFIX }SET_ACTIVE_AI_FIXES_BUTTON`;

/**
 * Updates the active AI fixes button id.
 *
 * @param {string} activeAIButton The active AI fixes button id.
 *
 * @returns {Object} An action for redux.
 */
export function setActiveAIFixesButton( activeAIButton ) {
	return {
		type: SET_ACTIVE_AI_FIXES_BUTTON,
		activeAIButton,
	};
}
