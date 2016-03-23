var firstParagraphAssessment = require( "../../js/assessments/firstParagraph.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for finding the keyword in the first paragraph", function() {
	it( "returns a keyword found in the first paragraph", function() {
		var assessment = firstParagraphAssessment( paper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The focus keyword appears in the first paragraph of the copy." );
	} );

	it( "returns multiple keywords found in the first paragraph", function() {
		var assessment = firstParagraphAssessment( paper, Factory.buildMockResearcher( 10 ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The focus keyword appears in the first paragraph of the copy." );
	} );

	it( "returns no keyword found in the first paragraph", function() {
		var assessment = firstParagraphAssessment( paper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The focus keyword doesn\'t appear in the first paragraph of the copy. Make sure the topic is clear immediately." );
	} );
});