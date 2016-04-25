var subheadingPresence = require( "../../js/assessments/subheadingPresenceAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "Assesses presence of subheadings", function(){
	it( "assesses no subheadings", function() {
		var mockPaper = new Paper();
		var assessment = subheadingPresence.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "The text does not contain any subheadings. Add at least one subheading." );
	} );

	it( "assesses 1 subheading", function() {
		var mockPaper = new Paper();
		var assessment = subheadingPresence.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The text contains 1 subheading, which is great." );
	} );

	it( "assesses 1 subheading", function() {
		var mockPaper = new Paper();
		var assessment = subheadingPresence.getResult( mockPaper, Factory.buildMockResearcher( 4 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The text contains 4 subheadings, which is great." );
	} );
} );
