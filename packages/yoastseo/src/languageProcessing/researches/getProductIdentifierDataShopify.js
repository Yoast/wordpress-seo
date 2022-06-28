/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalIdentifier( paper ) {
	const customData = paper.getCustomData();
	return customData.barcode !== "";
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasVariants( paper ) {
	//const customData = paper.getCustomData;
	return false;
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function doAllVariantsHaveIdentifier( paper ) {
	//const customData = paper.getCustomData;
	return false;
}

export default function( paper ) {
	return {
		hasGlobalIdentifier: hasGlobalIdentifier( paper ),
		hasVariants: hasVariants( paper ),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier( paper ),
	}
}
