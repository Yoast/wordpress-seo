/**
 * Checks whether a specific identifier field for a product is filled in.
 */
const isIdentifierFilledIn = function( elementID ) {
	const identifierValue = document.querySelector( '#' + elementID ).value;
	//const identifierValue = document.getElementById("elementID" ).value;

	return identifierValue !== undefined && identifierValue !== "";
}

/**
 * Returns whether the product (or product variant) has at least one product identifier filled in.
 *
 * @returns {boolean} Whether the product/variant has at least one identifier.
 */
const hasAtLeastOneIdentifier = function( identifierNames ) {
	const hasIdentifiers = identifierNames.map( identifier => isIdentifierFilledIn( identifier ) );

	return hasIdentifiers.includes( true );
}

/**
 *
 * @returns {boolean}
 */
export function hasGlobalIdentifier() {
	const identifierNames = [ "yoast_identifier_gtin8", "yoast_identifier_gtin12", "yoast_identifier_gtin13",
		"yoast_identifier_gtin14", "yoast_identifier_isbn", "yoast_identifier_mpn" ];

	return hasAtLeastOneIdentifier( identifierNames );
}


/**
 * Checks whether there are variants for a product.
 */
export function hasVariants() {
	const variantsMetabox = document.querySelector( "#variable_product_options_inner" );
	const variants = variantsMetabox.querySelector(".woocommerce_variations" );
	const numberOfVariants = variants.getAttribute("data-total");

	return numberOfVariants !== undefined && numberOfVariants !== "0";
}


/**
 * Checks whether all variants of a product have an identifier.
 */
export function allVariantsHaveIdentifier() {
	const allVariants = document.querySelectorAll( ".woocommerce_variation" );

	for ( let i = 0; i < allVariants.length; i++ ) {
		let variant = allVariants[ i ];
		let variantID = variant.querySelector( ".variable_post_id" ).value

		let identifierNames = [ `yoast_variation_identifier\\[${variantID}\\]\\[gtin8\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[gtin12\\]`, `yoast_variation_identifier\\[${variantID}\\]\\[gtin13\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[gtin14\\]`, `yoast_variation_identifier\\[${variantID}\\]\\[isbn\\]`,
			`yoast_variation_identifier\\[${variantID}\\]\\[mpn\\]` ];

		if ( ! hasAtLeastOneIdentifier( identifierNames ) ) {
			return false;
		}
	}
	return true;
}

// individual variant boxes are direct children of the div with .woocommerce-variations class (selected in hasVariants)
// the boxes with variants have .woocommerce_variation class -> get all children with that class?
// variation id can be retrieved from input element with class .variable_post_id nested inside h3 element under the .woocommerce_variation class
// id of input field for identifier = yoast_variation_identifier[variation id][identifier name]

