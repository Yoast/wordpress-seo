// The research will return the following information:
//
// Whether there are variants.
//
// (if there are variants) if the SKU/product identifier is filled in for each variant.
//
// If the global identifier/SKU is filled in.

/**
 * Checks whether the identifiers field for a product are filled in.
 */
export function isIdentifierFilledIn( elementID ) {
	// If product has a global identifier it returns its value.
	return document.getElementById( elementID ).value !== undefined && document.getElementById( elementID ).value !== "";
}

// /**
//  * Returns whether the product has at least one product identifier.
//  *
//  * @returns {boolean} Whether the product has an identifier.
//  */
// export function hasGlobalIdentifier() {
// 	const identifierNames = [ "yoast_identifier_gtin8", "yoast_identifier_gtin12", "yoast_identifier_gtin13",
// 		"yoast_identifier_gtin14", "yoast_identifier_isbn", "yoast_identifier_mpn" ];
//
// 	console.log( identifierNames, "identifierNames");
//
// 	const identifierValues = identifierNames.map( identifier => isIdentifierFilledIn( identifier ) );
// 	console.log( identifierValues, "identifierValues");
//
//
// 	return identifierValues.includes( true );
// }

/**
 * Checks whether there are variants for a product.
 */
export function hasVariants() {
	const numberOfVariants = document.getElementsByClassName( "woocommerce_variations wc-metaboxes ui-sortable" ).namedItem( "data-total" );
	if ( numberOfVariants !== "" ) {
		return true;
	} return false;
}
// && numberOfVariants !== "" && numberOfVariants !== "0"
//
// /**
//  * Checks whether all variants for a product have an identifier.
//  */
// const allVariantsHaveIdentifier = function() {
// 	if (all variants have identifier) {
// 		return true;
// 	}
// };




