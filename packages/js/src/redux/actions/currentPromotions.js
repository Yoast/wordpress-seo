export const SET_CURRENT_PROMOTIONS = "SET_CURRENT_PROMOTIONS";

/**
 * Set current promotions.
 *
 * @param {Object} currentPromotions An object of current promotions.
 *
 * @returns {Object} An action to dispatch.
 */
export function setCurrentPromotions( currentPromotions ) {
	return {
		type: SET_CURRENT_PROMOTIONS,
		payload: currentPromotions,
	};
}
