import sentenceLengthInTextAssessment from "../../src/scoring/assessments/readability/sentenceLengthInTextAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
import Mark from "../../src/values/Mark.js";
const i18n = Factory.buildJed();
import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";
import PolishResearcher from "../../src/languageProcessing/languages/pl/Researcher";
import SpanishResearcher from "../../src/languageProcessing/languages/es/Researcher";

describe( "An assessment for sentence length", function() {
	it( "returns the score for all short sentences in English", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Short sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new EnglishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 50 % short sentences in English", function() {
		const mockPaper = new Paper( "Short sentence. Long sentence long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new EnglishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 50% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100 % long sentences in English", function() {
		const mockPaper = new Paper( "Long sentence long sentence long sentence long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence.. Long sentence long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new EnglishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25 % short sentences in English", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Short sentence. Long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new EnglishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 30 % short sentences in English", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Short sentence. Short sentence. Short sentence. Short sentence. Short" +
			" sentence. Long sentence long sentence long sentence long sentence long sentence long sentence long sentence long sentence long " +
			"sentence long sentence long sentence. Long sentence long sentence long sentence long sentence long sentence long sentence long " +
			"sentence long sentence long sentence long sentence long sentence. Long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new EnglishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 30% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25 % short sentences in Polish", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Short sentence. Long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new PolishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 25% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100 % short sentences in Spanish", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Short sentence. Short sentence short sentence short sentence short sentence " +
			"short sentence short sentence short sentence short sentence short sentence short sentence short sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new SpanishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 50 % short sentences in Spanish", function() {
		const mockPaper = new Paper( "Short sentence. Short sentence. Long sentence long sentence long sentence long sentence long sentence long" +
			" sentence long sentence long sentence long sentence long sentence long sentence long sentence long sentence. Long sentence long " +
			"sentence long sentence long sentence long sentence long sentence long sentence long sentence long sentence long sentence long " +
			"sentence long sentence long sentence." );
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, new SpanishResearcher( mockPaper ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 50% of the sentences" +
			" contain more than 25 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking too long sentences", function() {
	it( "returns markers for too long sentences", function() {
		const paper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		const expected = [
			new Mark( { original: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?",
				marked: "<yoastmark class='yoast-text-mark'>This is a too long sentence, because it has over twenty words, and that is hard too" +
					" read, don't you think?</yoastmark>" } ),
		];
		expect( sentenceLengthInTextAssessment.getMarks( paper, new EnglishResearcher( paper ) ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences are too long", function() {
		const paper = new Paper( "This is a short sentence." );
		const expected = [];
		expect( sentenceLengthInTextAssessment.getMarks( paper, new PolishResearcher( paper ) ) ).toEqual( expected );
	} );
} );

describe( "A test for marking too short sentences", function() {
	it( "calculatePercentage returns nothing if there are no sentences", function() {
		expect( sentenceLengthInTextAssessment.calculatePercentage( [] ) ).toEqual( 0 );
	} );
} );
