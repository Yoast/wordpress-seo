import ImageCountAssessment from "../../../../src/scoring/assessments/seo/ImageCountAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

const imageCountAssessment = new ImageCountAssessment();

describe( "An image count assessment", function() {
	it( "assesses no images", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: " +
			"No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a text with one image", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: Good job!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );
