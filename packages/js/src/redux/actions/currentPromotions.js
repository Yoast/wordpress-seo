export const SET_CURRENT_PROMOTIONS = "SET_CURRENT_PROMOTIONS";

/**
 * Set current promotions.
 *
 * @param {Object} currentPromotions An object of current promotions.
 *
 * @returns {Object} A DISMISS_ALERT_SUCCESS action.
 */
export function setCurrentPromotions( currentPromotions ) {
	return {
		type: SET_CURRENT_PROMOTIONS,
		payload: currentPromotions,
	};
}
