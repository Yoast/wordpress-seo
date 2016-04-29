var subheadingDistributionTooShort = require( "../../js/assessments/subheadingDistributionTooShortAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too long sub texts.", function() {
	it( "scores 3 subheading texts, 0 are too long", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ 40,  100, 300 ] ), i18n );
		expect( assessment.getScore() ).toBe( 7.05 );
		expect( assessment.getText() ).toBe( "The amount of words following after each of your subheadings all exceed the recommended minimum of 40 words, which is great." );
	} );

	it( "scores 3 subheading texts, 0 are too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ 53,  100, 200 ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The amount of words following after each of your subheadings all exceed the recommended minimum of 40 words, which is great." );
	} );

	it ( "returns no score, because the string has no subheadings", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.hasScore() ).toBe( false );
	} );

	it ( "returns a heading that is too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ 10,  200, 300 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the subheadings is followed by less than the recommended minimum of 40 words. Consider deleting that particular subheading, or the following subheading." );
	} );

	it ( "returns 3 headings that are too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ 10,  20, 30, 310 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "3 of the subheadings are followed by less than the recommended minimum of 40 words. Consider deleting those particular subheadings, or the subheading following each of them." );
	} );

	it( "returns false because the paper has no text", function(){
		var assessment = subheadingDistributionTooShort.isApplicable( paper );
		expect( assessment ).toBe( false );
	} );

	it( "returns true because the paper has text", function(){
		var assessment = subheadingDistributionTooShort.isApplicable( new Paper("text") );
		expect( assessment ).toBe( true );
	} );
});

