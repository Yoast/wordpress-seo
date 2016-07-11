var pageTitleLengthAssessment = require( "../../js/assessments/pageTitleWidthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the page title length assessment", function() {
	it( "should assess a paper without a page title", function() {
		var paper = new Paper( "" );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toEqual( 1 );
		expect( result.getText() ).toEqual( "Please create a page title." );
	});

	it( "should assess a paper with a page title that's under the recommended value", function() {
		var paper = new Paper( "", { title: "The Title" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 9 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "The page title is too short. Use the space to add keyword variations or create compelling call-to-action copy." );

	});

	it( "should assess a paper with a page title that's in range of the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 450 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "The page title has a nice length." );

	});

	it( "should assess a paper with a page title that's in range of the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 600 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "The page title has a nice length." );

	});

	it( "should assess a paper with a page title that's longer than the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is Too Long Long To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 620 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "The page title is wider than the viewable limit." );

	});
});
