var pageTitleLengthAssessment = require( "../../js/assessments/pageTitleLength.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the page title length assessment", function() {
	it( "should assess a paper without a page title", function() {
		var paper = new Paper( "" );
		var result = pageTitleLengthAssessment.callback( paper, factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toEqual( 1 );
		expect( result.getText() ).toEqual( "Please create a page title." );
	});

	it( "should assess a paper with a page title that's under the recommended value", function() {
		var paper = new Paper( "", { title: "The Title" } );
		var result = pageTitleLengthAssessment.callback( paper, factory.buildMockResearcher( 9 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "The page title contains 9 characters, which is less than the recommended minimum of 35 characters. " +
		                                    "Use the space to add keyword variations or create compelling call-to-action copy." );

	});

	it( "should assess a paper with a page title that's in range of the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		var result = pageTitleLengthAssessment.callback( paper, factory.buildMockResearcher( 58 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "The page title is between the 35 character minimum and the recommended 65 character maximum." );

	});

	it( "should assess a paper with a page title that's longer than the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is Too Long Long To Pass" } );
		var result = pageTitleLengthAssessment.callback( paper, factory.buildMockResearcher( 67 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "The page title contains 67 characters, which is more than the viewable limit of 65 characters; " +
		                                    "some words will not be visible to users in your listing." );

	});
});
