/**
 * Gets the product identifier data from the paper.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {{hasVariants: (boolean|*), hasGlobalIdentifier: (boolean|*), doAllVariantsHaveIdentifier: (boolean|*) }}
 * The object that contains information whether the product has global identifier or variants.
 */
export default function( paper ) {
	const customData = paper.getCustomData();
	console.log( customData, "customData" );
	const productData = {
		hasGlobalIdentifier: customData.hasGlobalIdentifier,
		hasVariants: customData.hasVariants,
	};
	if ( customData.hasOwnProperty( "doAllVariantsHaveIdentifier" ) ) {
		productData.doAllVariantsHaveIdentifier = customData.doAllVariantsHaveIdentifier;
	}
	if ( customData.hasOwnProperty( "variantIdentifierDataIsValid" ) ) {
		productData.isVariantIdentifierDataValid = customData.isVariantIdentifierDataValid;
	}
	return productData;
}
