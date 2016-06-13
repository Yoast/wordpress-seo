var subheadingDistributionTooShort = require( "../../js/assessments/subheadingDistributionTooShortAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring too long sub texts.", function() {
	it( "scores 3 subheading texts, 0 are too long", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ {text: "", wordCount: 40},{text: "", wordCount: 100},{text: "", wordCount: 300} ] ), i18n );
		expect( assessment.getScore() ).toBe( 7.05 );
		expect( assessment.getText() ).toBe( "The number of words following each of your subheadings exceeds the recommended minimum of 40 words, which is great." );
	} );

	it( "scores 3 subheading texts, 0 are too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ {text: "", wordCount: 53},{text: "", wordCount: 100},{text: "", wordCount: 200} ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The number of words following each of your subheadings exceeds the recommended minimum of 40 words, which is great." );
	} );

	it ( "returns no score, because the string has no subheadings", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.hasScore() ).toBe( false );
	} );

	it ( "returns a heading that is too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [{text: "", wordCount: 10},{text: "", wordCount: 200},{text: "", wordCount: 300} ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The number of words following 1 of your subheadings is less than or equal to the recommended minimum. The recommended minimum is 40 words. Consider deleting that particular subheading, or the following subheading." );
	} );

	it ( "returns 3 headings that are too short", function() {
		var assessment = subheadingDistributionTooShort.getResult( paper, Factory.buildMockResearcher( [ {text: "", wordCount: 10},{text: "", wordCount: 20},{text: "", wordCount: 30},{text: "", wordCount: 310}
		 ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The number of words following 3 of your subheadings is less than or equal to the recommended minimum. The recommended minimum is 40 words. Consider deleting those particular subheadings, or the subheading following each of them." );
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

