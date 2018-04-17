const PREFIX = "WPSEO_";

export const SET_ACTIVE_TAB = `${ PREFIX }SET_ACTIVE_TAB`;

/**
 * An action creator for setting the active tab.
 *
 * @param {string} tab The active tab.
 *
 * @returns {Object} Action.
 */
export const setActiveTab = function( tab ) {
	return {
		type: SET_ACTIVE_TAB,
		tab,
	};
};
