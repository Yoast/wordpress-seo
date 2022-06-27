/**
 * Returns whether the product (or product variant) has at least one product identifier filled in.
 *
 * @param {[string]}  identifierIDs		The IDs of the identifiers to check.
 *
 * @returns {boolean} Whether the product/variant has at least one identifier.
 */
const hasAtLeastOneIdentifier = function( identifierIDs ) {
	for (let i = 0; i < identifierIDs.length; i++) {
		let identifierID = identifierIDs[i];
		let identifierValue = document.querySelector('#' + identifierID).value;
		if ( identifierValue !== undefined && identifierValue !== "" ) {
			return true;
		}
	}
	return false;
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
export function hasGlobalIdentifier() {
	const identifierNames = [ "yoast_identifier_gtin8", "yoast_identifier_gtin12", "yoast_identifier_gtin13",
		"yoast_identifier_gtin14", "yoast_identifier_isbn", "yoast_identifier_mpn" ];

	return hasAtLeastOneIdentifier( identifierNames );
}

/**
 * Checks whether there are variants for a product.
 *
 * @returns {boolean} Whether the product has variants.
 */
export function hasVariants() {
	const variantsMetabox = document.querySelector( "#variable_product_options_inner" );
	const variants = variantsMetabox.querySelector(".woocommerce_variations" );
	const numberOfVariants = variants.getAttribute("data-total");

	return numberOfVariants !== undefined && numberOfVariants !== "0";
}

/**
 * Checks whether all variants of a product have an identifier.
 *
 * @returns {boolean} Whether all variants of a product have an identifier.
 */
export function allVariantsHaveIdentifier() {
	const allVariants = document.querySelectorAll( ".woocommerce_variation" );

	for ( let i = 0; i < allVariants.length; i++ ) {
		let variant = allVariants[ i ];
		let variantID = variant.querySelector( ".variable_post_id" ).value

		let identifierIDs = [ `yoast_variation_identifier\\[${variantID}\\]\\[gtin8\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[gtin12\\]`, `yoast_variation_identifier\\[${variantID}\\]\\[gtin13\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[gtin14\\]`, `yoast_variation_identifier\\[${variantID}\\]\\[isbn\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[mpn\\]` ];

		if ( ! hasAtLeastOneIdentifier( identifierIDs ) ) {
			return false;
		}
	}
	return true;
}
