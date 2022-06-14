import PassiveVoiceAssessment from "../../../../src/scoring/assessments/readability/PassiveVoiceAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import wordComplexityAssessment from "../../../../src/scoring/assessments/readability/wordComplexityAssessment";

describe( "An assessment for scoring passive voice.", function() {
	const paper = new Paper();
	it( "returns result when the text is empty", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 0, passives: [] } ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough" +
			" active voice. That's great!" );
	} );

	it( "scores 0 passive sentences - 0%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [] } ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough" +
			" active voice. That's great!" );
	} );

	it( "scores 1 passive sentence - 5%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1 ] } ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough" +
			" active voice. That's great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 2 passive sentences - 10%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1, 2 ] } ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough" +
			" active voice. That's great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 10 passive sentence - 50%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 20,
			passives: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] } ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 50% of the sentences" +
			" contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 25%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 20, passives: [ 1, 2, 3, 4, 5 ] } ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 25% of the sentences" +
			" contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 13.3%", function() {
		const assessment = new PassiveVoiceAssessment().getResult( paper, Factory.buildMockResearcher( { total: 30, passives: [ 1, 2, 3, 4 ] } ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 13.3% of the sentences" +
			" contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "A test for checking the applicability", function() {
	it( "returns true for isApplicable for an English paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper. With at least 50 characters.", { locale: "en_US" } );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( true );
	} );

	it( "should return false for isApplicable for a paper with only an image.", function() {
		const paper = new Paper( "<img src='https://example.com/image.png' alt='test'>" );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "should return false for isApplicable for a paper with only spaces.", function() {
		const paper = new Paper( "        " );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false if the text is too short", function() {
		const paper = new Paper( "hallo" );
		expect( wordComplexityAssessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		const paper = new Paper( "", { locale: "af_ZA" } );
		expect( new PassiveVoiceAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );
} );

describe( "A test for marking passive sentences", function() {
	it( "returns markers for passive sentences", function() {
		const paper = new Paper( "A very interesting paper has been written." );
		const passiveVoice = Factory.buildMockResearcher( { total: 1, passives: [ "A very interesting paper has been written." ] } );
		const expected = [
			new Mark( { original: "A very interesting paper has been written.",
				marked: "<yoastmark class='yoast-text-mark'>A very interesting paper has been written.</yoastmark>" } ),
		];
		expect( new PassiveVoiceAssessment().getMarks( paper, passiveVoice ) ).toEqual( expected );
	} );

	it( "returns no markers for active sentences", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const passiveVoice = Factory.buildMockResearcher( [ { total: 0, passives: [] } ] );
		const expected = [];
		expect( new PassiveVoiceAssessment().getMarks( paper, passiveVoice ) ).toEqual( expected );
	} );
} );
