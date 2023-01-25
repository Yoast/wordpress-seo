export const SET_IS_PREMIUM = "SET_IS_PREMIUM";

/**
 * @param {boolean} isPremium The is premium boolean.
 * @returns {Object} Action object.
 */
export const setIsPremium = ( isPremium ) => ( {
	type: SET_IS_PREMIUM,
	payload: isPremium,
} );
