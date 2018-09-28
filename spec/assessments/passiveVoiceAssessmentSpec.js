import passiveVoiceAssessment from "../../src/assessments/readability/passiveVoiceAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

var paper = new Paper();
describe( "An assessment for scoring passive voice.", function() {
	it( "scores 0 passive sentences - 0%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [] } ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!" );
	} );

	it( "scores 1 passive sentence - 5%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 2 passive sentences - 10%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1, 2 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 10 passive sentence - 50%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 50% of the sentences contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 25%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1, 2, 3, 4, 5 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 25% of the sentences contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 13.3%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( { total: 30, passives: [ 1, 2, 3, 4 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 13.3% of the sentences contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "A test for checking the applicability", function() {
	it( "returns true for isApplicable for an English paper with text.", function() {
		var paper = new Paper( "This is a very interesting paper.", { locale: "en_EN" } );
		expect( passiveVoiceAssessment.isApplicable( paper ) ).toBe( true );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		var paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( passiveVoiceAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper without text.", function() {
		var paper = new Paper( "", { locale: "en_EN" } );
		expect( passiveVoiceAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		var paper = new Paper( "", { locale: "af_ZA" } );
		expect( passiveVoiceAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );

describe( "A test for marking passive sentences", function() {
	it( "returns markers for passive sentences", function() {
		paper = new Paper( "A very interesting paper has been written." );
		var passiveVoice = Factory.buildMockResearcher( { total: 1, passives: [ "A very interesting paper has been written." ] } );
		var expected = [
			new Mark( { original: "A very interesting paper has been written.",
				marked: "<yoastmark class='yoast-text-mark'>A very interesting paper has been written.</yoastmark>" } ),
		];
		expect( passiveVoiceAssessment.getMarks( paper, passiveVoice ) ).toEqual( expected );
	} );

	it( "returns no markers for active sentences", function() {
		paper = new Paper( "This is a very interesting paper." );
		var passiveVoice = Factory.buildMockResearcher( [ { total: 0, passives: [] } ] );
		var expected = [];
		expect( passiveVoiceAssessment.getMarks( paper, passiveVoice ) ).toEqual( expected );
	} );
} );
