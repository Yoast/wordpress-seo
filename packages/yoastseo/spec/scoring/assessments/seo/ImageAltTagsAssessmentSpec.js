import ImageAltTagsAssessment from "../../../../src/scoring/assessments/seo/ImageAltTagsAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

const imageAltTagsAssessment = new ImageAltTagsAssessment();

describe( "test to check if all images have alt tags", function() {
	it( "assesses text with 4 images and none of them has alt tags", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 4,
				withAlt: 0,
			},
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='' target='_blank'>Image alt tags</a>: None of the images " +
			"has alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses text with 4 images and 1 of the doesn't have alt tags", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 1,
				withAlt: 3,
			},
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='' target='_blank'>Image alt tags</a>: 1 image out of 4 " +
			"doesn't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses text with 4 images and 2 of the doesn't have alt tags", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const assessment = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 2,
				withAlt: 2,
			},
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='' target='_blank'>Image alt tags</a>: 2 images out of 4 " +
			"don't have alt attributes. <a href='' target='_blank'>Add alt attributes to your images</a>!" );
	} );

	it( "assesses a text with 4 images and all of them have alt attributes", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		const assessment = imageAltTagsAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 4,
			altTagCount: {
				noAlt: 0,
				withAlt: 4,
			},
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='' target='_blank'>Image alt tags</a>: All images have alt attributes. Good job!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( imageAltTagsAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ) ) ).toBe( false );
	} );

	it( "returns false when the paper is not empty but there is no image present.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( imageAltTagsAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ) ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty and there is an image present.", function() {
		const paper = new Paper( "These are just five words <img src='image.jpg' />" );
		expect( imageAltTagsAssessment.isApplicable( paper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ) ) ).toBe( true );
	} );
} );
