import productIdentifierData from "../../../src/languageProcessing/researches/getProductIdentifierDataWooCommerce.js";

// Set up mock DOM data.
document.body.innerHTML =
	'<div>' +
	'  <input type="text" id="yoast_identifier_gtin8" value="" >' +
	'  <input type="text" id="yoast_identifier_gtin12" value="" >' +
	'  <input type="text" id="yoast_identifier_gtin13" value="" >' +
	'  <input type="text" id="yoast_identifier_gtin14" value="789" >' +
	'  <input type="text" id="yoast_identifier_isbn" value="" >' +
	'  <input type="text" id="yoast_identifier_mpn" value="" >' +
	'</div>' +
	'<div id="variable_product_options_inner" >' +
	'  <div class="woocommerce_variations" data-total="2" >' +
	'		<div class="woocommerce_variation">' +
	'			<h3>' +
	'				<input type="hidden" class="variable_post_id" value="12" >' +
	'			</h3>' +
	'			<div>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][gtin8]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][gtin12]" value="34">' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][gtin13]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][gtin14]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][isbn]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[12][mpn]" value>' +
	'				</p>' +
	'			</div>' +
	'		<div class="woocommerce_variation">' +
	'			<h3>' +
	'				<input type="hidden" class="variable_post_id" value="13" >' +
	'			</h3>' +
	'			<div>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][gtin8]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][gtin12]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][gtin13]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][gtin14]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][isbn]" value>' +
	'				</p>' +
	'				<p>' +
	'					<input type="text" id="yoast_variation_identifier[13][mpn]" value>' +
	'				</p>' +
	'			</div>' +
	'		</div>' +
	'	</div>' +
	'</div>';

describe( "A test to check if at least one global product identifier is filled in", () => {
	it( "returns true if at least one identifier is filled in", function() {
		expect( productIdentifierData().hasGlobalIdentifier ).toEqual( true );
	} );

	it( "returns false if no identifiers are filled in", function() {
		// Change value of the filled in attribute to empty string.
		document.querySelector('#yoast_identifier_gtin14').setAttribute( 'value', '')

		expect( productIdentifierData().hasGlobalIdentifier ).toEqual( false );
	} );
} );

describe( "A test to check if the product has variants", () => {
	it( "returns true if the data-total attribute of the woocommerce_variations class is not 0 or undefined", function() {
		expect( productIdentifierData().hasVariants ).toEqual( true );
	} );

	it( "returns false if the data-total attribute of the woocommerce_variations class is 0", function() {
		// Change value of data-total to 0.
		document.querySelector('.woocommerce_variations').setAttribute( 'data-total', '0')

		expect( productIdentifierData().hasVariants ).toEqual( false );
	} );
} );

describe( "A test to check if all variants of a product have an identifier", () => {
	it( "returns false if one or more of the variants doesn't have an identifier", function() {
		expect( productIdentifierData().allVariantsHaveIdentifier ).toEqual( false );
	} );

	it( "returns true if all variants have an identifier", function() {
		// Change one of the identifiers to an empty string.
		document.querySelector("#yoast_variation_identifier\\[13\\]\\[gtin12\\]").setAttribute( 'value', '98')

		expect( productIdentifierData().allVariantsHaveIdentifier ).toEqual( true );
	} );
} );
