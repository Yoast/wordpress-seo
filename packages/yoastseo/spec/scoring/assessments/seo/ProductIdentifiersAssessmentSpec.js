import { __, sprintf } from "@wordpress/i18n";
import ProductIdentifiersAssessment from "../../../../src/scoring/assessments/seo/ProductIdentifiersAssessment";
import Paper from "../../../../src/values/Paper";

const paper = new Paper( "" );


describe( "a test for Product identifiers assessment for WooCommerce", function() {
	const assessment = new ProductIdentifiersAssessment( { assessVariants: true, shouldShowEditButton: true } );

	it( "returns the score 9 when a product has a global identifier and no variants", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 9 when a grouped product has a global identifier and no variants", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "grouped",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 9 when an external product has a global identifier and no variants", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "external",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 9 when a product has no global identifier, but has variants and all variants have an identifier", function() {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: true,
			doAllVariantsHaveIdentifier: true,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"All your product variants have an identifier. Good job!" );
	} );

	it( "returns the score 6 when a product has no global identifier and no variants", function() {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Your product is missing an identifier (like a GTIN code)." +
			" <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" it if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has a global identifier and variants, but not all variants have an identifier", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Not all your product variants have an identifier. " +
			"<a href='https://yoa.st/4lz' target='_blank'>Include it if you can, as it " +
			"will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has no global identifier, but has variants and not all variants have an identifier", function() {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Not all your product variants have an identifier." +
			" <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" it if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 9 with the feedback for a simple product when a variable product has no variants but has a global identifier", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 6 with the feedback for a simple product when a variable product has no variants and no global identifier", function() {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Your product is missing an identifier (like a GTIN code)." +
			" <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" it if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns `hasJump` as true when `shouldEditButton` is set to true and the score is less than 9", function() {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.hasJumps() ).toBeTruthy();
	} );
} );

describe( "a test for Product identifiers assessment for Shopify", () => {
	/**
	 * Returns the result texts for the Barcode assessment.
	 * @param {string} urlTitleAnchorOpeningTag The anchor opening tag to the article about this assessment.
	 * @param {string} urlActionAnchorOpeningTag The anchor opening tag to the call to action URL to the help article of this assessment.
	 * @returns {{good: {withoutVariants: string, withVariants: string}, okay: {withoutVariants: string, withVariants: string}}} The feedback strings.
	 */
	const getResultTexts = ( { urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag } ) => {
		return {
			good: {
				withoutVariants: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sBarcode%2$s: Your product has a barcode. Good job!",
						"shopify-seo"
					),
					urlTitleAnchorOpeningTag,
					"</a>"
				),
				withVariants: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sBarcode%2$s: All your product variants have a barcode. Good job!",
						"shopify-seo"
					),
					urlTitleAnchorOpeningTag,
					"</a>"
				),
			},
			okay: {
				withoutVariants: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sBarcode%3$s: Your product is missing a barcode (like a GTIN code). %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
						"shopify-seo"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
				withVariants: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sBarcode%3$s: Not all your product variants have a barcode. %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
						"shopify-seo"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
			},
		};
	};
	const assessment = new ProductIdentifiersAssessment( {
		urlTitle: "https://yoa.st/shopify81",
		urlCallToAction: "https://yoa.st/shopify82",
		callbacks: { getResultTexts },
	} );

	it( "returns with score 9 when the product has global identifier and no variants", () => {
		const customData = {
			hasGlobalIdentifier: true,
			hasVariants: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify81' target='_blank'>Barcode</a>: " +
			"Your product has a barcode. Good job!" );
	} );

	it( "returns with score 6 when the product doesn't have a global identifier nor variants", () => {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify81' target='_blank'>Barcode</a>:" +
			" Your product is missing a barcode (like a GTIN code). <a href='https://yoa.st/shopify82' target='_blank'>Include" +
			" it if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns `hasJumps` as false for shopify, since the `shouldEditButton` is set to false even though the score is less than 9", () => {
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};

		const paperWithCustomData = new Paper( "", { customData } );
		const assessmentResult = assessment.getResult( paperWithCustomData );

		expect( assessmentResult.hasJumps() ).toBeFalsy();
	} );
} );

describe( "a test for the applicability of the assessment", function() {
	it( "is applicable when the assessVariants variable is set to true", function() {
		const assessment = new ProductIdentifiersAssessment();
		const isApplicable = assessment.isApplicable( paper );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when the assessVariants variable is set to false and the product has variants", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: false } );
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when the assessVariants variable is set to false and the product doesn't have variants", function() {
		const assessment = new ProductIdentifiersAssessment();
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is applicable when the global identifier of a simple product can be detected", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalIdentifier: true,
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is applicable when the global identifier of an external product can be detected", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalIdentifier: true,
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "external",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when the global identifier of a simple product cannot be detected", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalIdentifier: false,
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is not applicable when the global identifier of an external product cannot be detected", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalIdentifier: false,
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "external",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when the global identifier cannot be detected on a product with variants", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveGlobalIdentifier: false,
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when the identifiers of at least one variant cannot be detected on product with variants", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantIdentifiers: false,
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when variant identifiers can be detected on product with variants", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantIdentifiers: true,
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "variable",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );

	it( "is applicable when variant identifiers can be detected on a simple product with variants (case when" +
		"hasVariants variable doesn't update correctly", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );
		const customData = {
			canRetrieveVariantIdentifiers: false,
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );
} );
