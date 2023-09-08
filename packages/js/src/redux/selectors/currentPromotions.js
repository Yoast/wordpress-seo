/**
 * Checks whether a certain promotion is active.
 *
 * @param {Object} state   The state.
 * @param {string} promoId The id of the promotion.
 *
 * @returns {Boolean} Whether or not the Alert is dismissed.
 */
export function isPromotionActive( state, promoId ) {
	return state.currentPromotions.promotions.includes( promoId );
}
