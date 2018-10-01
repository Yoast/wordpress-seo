import ImageCountAssessment from "../../src/assessments/seo/textImagesAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

let imageCountAssessment = new ImageCountAssessment();

describe( "An image count assessment", function() {
	it( "assesses no images", function() {
		var mockPaper = new Paper( "sample" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a single image, without a keyword and alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 1,
			withAlt: 0,
			withAltKeyword: 0,
			withAltNonKeyword: 0,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 1,
			withAltKeyword: 0,
			withAltNonKeyword: 0,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='keyword' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 0,
			withAltNonKeyword: 1,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 0,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 1,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample",
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 4,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 1,
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Some images on this page contain alt attributes with words from your keyphrase! Good job!" );
	} );
} );
