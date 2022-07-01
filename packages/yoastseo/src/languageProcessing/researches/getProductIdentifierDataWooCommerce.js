/**
 * Gets the product data from WooCommerce.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {{hasVariants: (boolean|*), hasGlobalIdentifier: (boolean|*)}}  The object that contains information whether
 * the product has global identifier or variants, and the information whether all variants have product identifier..
 */
export default function( paper ) {
	const productIdentifierData = paper.getCustomData();
	return {
		hasGlobalIdentifier: productIdentifierData.hasGlobalIdentifier,
		hasVariants: productIdentifierData.hasVariants,
		doAllVariantsHaveIdentifier: productIdentifierData.doAllVariantsHaveIdentifier,
	};
}
