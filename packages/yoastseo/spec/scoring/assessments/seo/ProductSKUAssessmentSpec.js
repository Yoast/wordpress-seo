import { createAnchorOpeningTag } from "../../../../src/helpers/shortlinker";
import ProductSKUAssessment from "../../../../src/scoring/assessments/seo/ProductSKUAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const paper = new Paper( "" );


describe( "a test for SKU assessment for WooCommerce", function() {
	const assessment = new ProductSKUAssessment();

	it( "returns the score 9 when a product has a global SKU and no variants", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: true,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: Good job!" );
	} );

	it( "returns the score 9 when a product has no global SKU, but has variants and all variants have a SKU", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: true,
			doAllVariantsHaveSKU: true,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: Good job!" );
	} );

	it( "returns the score 6 when a product has no global SKU and no variants", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Your product is missing a SKU. <a href='https://yoa.st/4lx' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has a global SKU and variants, but not all variants have a SKU", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: true,
			hasVariants: true,
			doAllVariantsHaveSKU: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Not all your product variants have a SKU. <a href='https://yoa.st/4lx' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has no global SKU, but has variants and not all variants have a SKU", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: true,
			doAllVariantsHaveSKU: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Not all your product variants have a SKU. <a href='https://yoa.st/4lx' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );
} );

describe( "a test for SKU assessment for Shopify", () => {
	const assessment = new ProductSKUAssessment( { urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify79" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify80" ),
		assessVariants: false,
	} );

	it( "returns with score 9 when the product has global SKU and no variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: true,
			hasVariants: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify79' target='_blank'>SKU</a>: Good job!" );
	} );

	it( "returns with score 6 when the product doesn't have a global SKU nor variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify79' target='_blank'>SKU</a>:" +
			" Your product is missing a SKU. <a href='https://yoa.st/shopify80' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "should not return a score if the product has variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: true,
		} ) );

		expect( assessmentResult.hasScore() ).toEqual( false );
	} );
} );

