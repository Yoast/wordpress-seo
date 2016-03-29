var descriptionLengthAssessment = require( "../../js/assessments/metaDescriptionLength.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An descriptionLength assessment", function(){
	it( "assesses an empty description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.callback( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual ( "No meta description has been specified, search engines will display copy from the page instead." );
	} );

	it( "assesses a short description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.callback( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "The meta description is under 120 characters, however up to 156 characters are available." );
	} );

	it( "assesses a too long description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.callback( mockPaper, Factory.buildMockResearcher( 200 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "The specified meta description is over 156 characters. Reducing it will ensure the entire description is visible." );
	} );

	it( "assesses a good description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.callback( mockPaper, Factory.buildMockResearcher( 140 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?" );
	} );


} );
