var subheadingDistributionTooLong = require( "../../js/assessments/subheadingDistributionTooLongAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too long sub texts.", function() {
	it( "scores 3 subheading texts, 0 are too long", function() {
		var assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ 60,  100, 300 ] ), i18n );
		expect( assessment.getScore() ).toBe( 7.02 );
		expect( assessment.getText() ).toBe( "The amount of words following each of your subheadings doesn't exceed the recommended maximum of 300 words, which is great." );
	} );

	it( "scores 3 subheading texts, 0 are too long", function() {
		var assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ 60,  100, 200 ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The amount of words following each of your subheadings doesn't exceed the recommended maximum of 300 words, which is great." );
	} );

	it ( "returns no score, because the string has no subheadings", function() {
		var assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.hasScore() ).toBe( false );
	} );
	it ( "returns a heading that is too long", function() {
		var assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ 60,  400, 300 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 of the subheadings is followed by more than the recommended maximum of 300 words. Try to insert another subheading." );
	} );

	it ( "returns a heading that is too long", function() {
		var assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ 60,  310, 310, 310 ] ), i18n );
		expect( assessment.getScore() ).toBe( 6.42 );
		expect( assessment.getText() ).toBe( "3 of the subheadings are followed by more than the recommended maximum of 300 words. Try to insert additional subheadings." );
	} );

	it( "returns false because the paper has no text", function(){
		var assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( false );
	} );

	it( "returns true because the paper has text", function(){
		var assessment = subheadingDistributionTooLong.isApplicable( new Paper("text") );
		expect( assessment ).toBe( true );
	} );

});
