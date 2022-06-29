/**
 * Returns whether the product (or product variant) has at least one product identifier filled in.
 *
 * @param {[string]}  identifierIDs		The IDs of the identifiers to check.
 *
 * @returns {boolean} Whether the product/variant has at least one identifier.
 */
const hasAtLeastOneIdentifier = function( identifierIDs ) {
	for ( let i = 0; i < identifierIDs.length; i++ ) {
		const identifierID = identifierIDs[ i ];
		const identifierValue = document.querySelector( "#" + identifierID ).value;
		// eslint-disable-next-line no-undefined
		if ( identifierValue !== undefined && identifierValue !== "" ) {
			return true;
		}
	}
	return false;
};

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalIdentifier() {
	const identifierNames = [ "yoast_identifier_gtin8", "yoast_identifier_gtin12", "yoast_identifier_gtin13",
		"yoast_identifier_gtin14", "yoast_identifier_isbn", "yoast_identifier_mpn" ];

	return hasAtLeastOneIdentifier( identifierNames );
}

/**
 * Checks whether there are variants for a product.
 *
 * @returns {boolean} Whether the product has variants.
 */
function hasVariants() {
	const variantsMetabox = document.querySelector( "#variable_product_options_inner" );
	const variants = variantsMetabox.querySelector( ".woocommerce_variations" );
	const numberOfVariants = variants.getAttribute( "data-total" );

	// eslint-disable-next-line no-undefined
	return numberOfVariants !== undefined && numberOfVariants !== "0";
}

/**
 * Checks whether all variants of a product have an identifier.
 *
 * @returns {boolean} Whether all variants of a product have an identifier.
 */
function doAllVariantsHaveIdentifier() {
	const allVariants = document.querySelectorAll( ".woocommerce_variation" );

	for ( let i = 0; i < allVariants.length; i++ ) {
		const variant = allVariants[ i ];
		const variantID = variant.querySelector( ".variable_post_id" ).value;

		const identifiers = [ "\\[gtin8\\]", "\\[gtin12\\]", "\\[gtin13\\]", "\\[gtin14\\]", "\\[isbn\\]", "\\[mpn\\]" ];

		const identifierIDs = identifiers.map( identifier => `yoast_variation_identifier\\[${variantID}\\]`.concat( identifier ) );

		if ( ! hasAtLeastOneIdentifier( identifierIDs ) ) {
			return false;
		}
	}
	return true;
}

export default function( paper ) {
	const productIdentifierData = paper.getCustomData();
	return {
		hasGlobalIdentifier: productIdentifierData.hasGlobalIdentifier,
		hasVariants: productIdentifierData.hasVariants,
		doAllVariantsHaveIdentifier: productIdentifierData.doAllVariantsHaveIdentifier,
	};
}
