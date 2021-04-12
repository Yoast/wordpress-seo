export const SET_SHOPPING_DATA = "SET_SHOPPING_DATA";

/**
 * Sets the products shopping data for the Google Preview.
 *
 * @param {Object} shoppingData The product data to show in the Google Preview.
 *
 * @returns {Object} An action for the reducer.
 */
export function setShoppingData( shoppingData ) {
	return {
		type: SET_SHOPPING_DATA,
		shoppingData,
	};
}
