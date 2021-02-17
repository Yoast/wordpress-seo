import addMark from "../../../../src/markers/addMark";
import SentenceLengthInTextAssessment from "../../../../src/scoring/assessments/readability/sentenceLengthInTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
const i18n = Factory.buildJed();
import spanishConfig from "../../../../src/languageProcessing/languages/es/config/sentenceLength";
import polishConfig from "../../../../src/languageProcessing/languages/pl/config/sentenceLength";
import hebrewConfig from "../../../../src/languageProcessing/languages/he/config/sentenceLength";
import russianConfig from "../../../../src/languageProcessing/languages/ru/config/sentenceLength";
import italianConfig from "../../../../src/languageProcessing/languages/it/config/sentenceLength";
import portugueseConfig from "../../../../src/languageProcessing/languages/pt/config/sentenceLength";
import catalanConfig from "../../../../src/languageProcessing/languages/ca/config/sentenceLength";
import turkishConfig from "../../../../src/languageProcessing/languages/tr/config/sentenceLength";

describe( "An assessment for sentence length", function() {
	/*it( "returns the score for all short sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 50% long sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"50% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 30% long sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"30% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );*/

	it( "returns the score for 100% long sentences in Russian", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		], false, false, russianConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		], false, false, russianConfig ) ) ).toEqual( [
			new Mark( {
				original: "",
				marked: addMark( "" ),
			} ),
		] );
	} );
/*
	it( "returns the score for 100% long sentences in Italian", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, italianConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Italian", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
		], false, false, italianConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Spanish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, spanishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Spanish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
		], false, false, spanishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Catalan", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, catalanConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Catalan", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
		], false, false, catalanConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% short sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },
		], false, false, polishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		], false, false, polishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 10% long sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		], false, false, polishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		], false, false, polishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 20% long sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		], false, false, polishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Portuguese", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, portugueseConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Portuguese", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
		], false, false, portugueseConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 25% long sentences in Portuguese", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
			{ sentence: "", sentenceLength: 20 },
			{ sentence: "", sentenceLength: 27 },
			{ sentence: "", sentenceLength: 24 },
		], false, false, portugueseConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Hebrew", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		], false, false, hebrewConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Hebrew", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, hebrewConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% short sentences in Turkish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, turkishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 25% long sentences in Turkish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		], false, false, turkishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 15 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Turkish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, turkishConfig ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );*/
} );

/*describe( "A test for marking too long sentences", function() {
	it( "returns markers for too long sentences", function() {
		const paper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		const sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a too long sentence, because it has over twenty" +
				" words, and that is hard too read, don't you think?", sentenceLength: 21 } ] );
		const expected = [
			new Mark( { original: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?",
				marked: "<yoastmark class='yoast-text-mark'>This is a too long sentence, because it has over twenty words, and that is hard too" +
					" read, don't you think?</yoastmark>" } ),
		];
		expect( new SentenceLengthInTextAssessment().getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences are too long", function() {
		const paper = new Paper( "This is a short sentence." );
		const sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a short sentence.", sentenceLength: 5 } ] );
		const expected = [];
		expect( new SentenceLengthInTextAssessment().getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );
} );

describe( "A test for marking too long sentences", function() {
	it( "calculatePercentage returns nothing if there are no sentences", function() {
		expect( new SentenceLengthInTextAssessment().calculatePercentage( [], 20 ) ).toEqual( 0 );
	} );
} );*/
