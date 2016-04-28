var imageCountAssessment = require( "../../js/assessments/textImagesAssessment" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An image count assessment", function() {
	it( "assesses no images", function(){
		var mockPaper = new Paper( "sample" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "No images appear in this page, consider adding some as appropriate." );
	} );

	it( "assesses a single image, without a keyword and alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 1,
			withAlt: 0,
			withAltKeyword: 0,
			withAltNonKeyword: 0
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "The images on this page are missing alt attributes." );
	} );

	it( "assesses a single image, without a keyword, but with an alt-tag set", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='image' />" );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 1,
			withAltKeyword: 0,
			withAltNonKeyword: 0
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "The images on this page contain alt attributes." );
	} );

	it( "assesses a single image, with a keyword and alt-tag set, but with a non-keyword alt-tag", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='keyword' />", {
			keyword: "Sample"
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 0,
			withAltNonKeyword: 1
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "The images on this page do not have alt attributes containing your focus keyword." );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample"
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 0
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample"
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 0,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 1
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );

	it( "assesses a single image, with a keyword and alt-tag set to keyword for 1 of 2 images", function() {
		var mockPaper = new Paper( "These are just five words <img src='image.jpg' alt='sample' />", {
			keyword: "Sample"
		} );

		var assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			noAlt: 4,
			withAlt: 0,
			withAltKeyword: 1,
			withAltNonKeyword: 1
		} ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );

} );
