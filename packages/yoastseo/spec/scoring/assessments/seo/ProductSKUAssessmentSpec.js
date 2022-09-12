import { createAnchorOpeningTag } from "../../../../src/helpers/shortlinker";
import ProductSKUAssessment from "../../../../src/scoring/assessments/seo/ProductSKUAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const paper = new Paper( "" );


describe( "a test for SKU assessment for WooCommerce", function() {
	const assessment = new ProductSKUAssessment( { assessVariants: true } );

	it( "returns the score 9 when a product has a global SKU and no variants", function() {
		const customData = {
			hasGlobalSKU: true,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: Your product has a SKU. Good job!" );
	} );

	it( "returns the score 9 when a product has no global SKU, but has variants and all variants have a SKU", function() {
		const customData = {
			hasGlobalSKU: false,
			hasVariants: true,
			doAllVariantsHaveSKU: true,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: All your product variants " +
			"have a SKU. Good job!" );
	} );

	it( "returns the score 6 when a product has no global SKU and no variants", function() {
		const customData = {
			hasGlobalSKU: false,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
			productType: "simple",
			addSKULocation: true,
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Your product is missing a SKU. You can add a SKU via the \"Inventory\" tab in the Product data box. " +
			"<a href='https://yoa.st/4lx' target='_blank'>Include it if you can, as it will help search engines " +
			"to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has a global SKU and variants, but not all variants have a SKU", function() {
		const customData = {
			hasGlobalSKU: true,
			hasVariants: true,
			doAllVariantsHaveSKU: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Not all your product variants have a SKU. You can add a SKU via the \"Variations\" tab in the Product " +
			"data box. <a href='https://yoa.st/4lx' target='_blank'>Include it if you can, as it will help search " +
			"engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has no global SKU, but has variants and not all variants have a SKU", function() {
		const customData = {
			hasGlobalSKU: false,
			hasVariants: true,
			doAllVariantsHaveSKU: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Not all your product variants have a SKU. You can add a SKU via the \"Variations\" tab in the Product " +
			"data box. <a href='https://yoa.st/4lx' target='_blank'>Include it if you can, as it will help search " +
			"engines to better understand your content.</a>" );
	} );

	it( "returns the score 9 with the feedback for a simple product when a variable product has no variants but has a global SKU", function() {
		const customData = {
			hasGlobalSKU: true,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: Your product has a SKU. Good job!" );
	} );

	it( "returns the score 6 with the feedback for a simple product when a variable product has no variants and no global SKU", function() {
		const customData = {
			hasGlobalSKU: false,
			hasVariants: false,
			doAllVariantsHaveSKU: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>:" +
			" Your product is missing a SKU. You can add a SKU via the \"Inventory\" tab in the Product data box. " +
			"<a href='https://yoa.st/4lx' target='_blank'>Include it if you can, as it will help search engines to " +
			"better understand your content.</a>" );
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
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify79' target='_blank'>SKU</a>: " +
			"Your product has a SKU. Good job!" );
	} );

	it( "returns with score 6 when the product doesn't have a global SKU nor variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalSKU: false,
			hasVariants: false,
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify79' target='_blank'>SKU</a>:" +
			" Your product is missing a SKU. <a href='https://yoa.st/shopify80' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );
} );

describe( "a test for the applicability of the assessment", function() {
	it( "is applicable when we want to assess variants and the SKU can be detected", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalSku: true,
			hasGlobalSKU: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when the SKU  of a simple product cannot be detected", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalSku: false,
			hasGlobalSKU: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is not applicable when the SKU of an external product cannot be detected", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalSku: false,
			hasGlobalSKU: false,
			hasVariants: false,
			productType: "external",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when we want to assess variants and when the global SKU cannot be detected on product with variants," +
		"but the variant SKU can", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantSkus: true,
			canRetrieveGlobalSku: false,
			hasGlobalSKU: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when we want to assess variants and the SKU of at least one variant cannot be detected on product with variants", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantSkus: false,
			hasGlobalSKU: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when we don't want to assess variants and the product doesn't have variants", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: false } );
		const customData = {
			hasGlobalSKU: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when we don't want to assess variants and the product has variants", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: false } );
		const customData = {
			hasGlobalSKU: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when variant SKUs can be detected on product with variants", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantSkus: true,
			hasGlobalSKU: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is applicable when variant SKUs can be detected on a simple product with variants" +
		" (case when hasVariants variable doesn't update correctly", function() {
		const assessment = new ProductSKUAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantSkus: false,
			hasGlobalSKU: false,
			hasVariants: true,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );
} );
