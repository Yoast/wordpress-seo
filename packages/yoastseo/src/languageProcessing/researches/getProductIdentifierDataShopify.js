/**
 * Gets the product data from Shopify.
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {{hasVariants: (boolean|*), hasGlobalIdentifier: (boolean|*)}}  The object that contains information whether
 * the product has global identifier or variants.
 */
export default function( paper ) {
	const productData = paper.getCustomData();
	return {
		hasGlobalIdentifier: productData.hasGlobalIdentifier,
		hasVariants: productData.hasVariants,
	};
}
