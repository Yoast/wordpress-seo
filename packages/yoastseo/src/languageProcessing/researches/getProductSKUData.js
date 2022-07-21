/**
 * Gets the product SKU data from the paper.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {{hasVariants: (boolean|*), hasGlobalIdentifier: (boolean|*), doAllVariantsHaveIdentifier: (boolean|*),
 * 			isVariantIdentifierDataValid: (boolean|*) }}
 * The object that contains information whether the product has global SKU or variants.
 */
export default function( paper ) {
	const customData = paper.getCustomData();
	const productData = {
		hasGlobalSKU: customData.hasGlobalSKU,
		hasVariants: customData.hasVariants,
	};
	if ( customData.hasOwnProperty( "doAllVariantsHaveSKU" ) ) {
		productData.doAllVariantsHaveSKU = customData.doAllVariantsHaveSKU;
	}
	if ( customData.hasOwnProperty( "variantIdentifierDataIsValid" ) ) {
		productData.isVariantIdentifierDataValid = customData.variantIdentifierDataIsValid;
	}
	return productData;
}
