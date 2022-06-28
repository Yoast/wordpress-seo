/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
export function hasGlobalIdentifier( paper ) {
	const customData = paper.getCustomData;
	return customData.barcode !== "";
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
export function hasVariants( paper ) {
	//const customData = paper.getCustomData;
	return false;
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
export function doAllVariantsHaveIdentifier( paper ) {
	//const customData = paper.getCustomData;
	return false;
}

export default function( ) {
	return {
		hasGlobalIdentifier: hasGlobalIdentifier( paper ),
		hasVariants: hasVariants(),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier(),
	}
}
