import SentenceLengthInTextAssessment from "../../src/scoring/assessments/readability/sentenceLengthInTextAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
import Mark from "../../src/values/Mark.js";
const i18n = Factory.buildJed();

const sentenceLengthInTextAssessment = new SentenceLengthInTextAssessment();
import contentConfiguration from "../../src/config/_todo/content/combinedConfig.js";

describe( "An assessment for sentence length", function() {
	it( "returns the score for all short sentences", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
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

	it( "returns the score for 50% long sentences", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
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

	it( "returns the score for 100% long sentences", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
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

	it( "returns the score for 30% long sentences", function() {
		const mockPaper = new Paper();
		const assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
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
	} );

	it( "returns the score for 100% long sentences in Russian", function() {
		const mockPaper = new Paper( "text", { locale: "ru_RU" } );
		const sentenceLengthInTextAssessmentRussian = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentRussian.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Italian", function() {
		const mockPaper = new Paper( "text", { locale: "it_IT" } );
		const sentenceLengthInTextAssessmentItalian = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentItalian.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for all short sentences in Italian", function() {
		const mockPaper = new Paper( "text", { locale: "it_IT" } );
		const sentenceLengthInTextAssessmentItalian = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentItalian.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Spanish", function() {
		const mockPaper = new Paper( "text", { locale: "es_ES" } );
		const sentenceLengthInTextAssessmentSpanish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentSpanish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for all short sentences in Spanish", function() {
		const mockPaper = new Paper( "text", { locale: "es_ES" } );
		const sentenceLengthInTextAssessmentSpanish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentSpanish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Catalan", function() {
		const mockPaper = new Paper( "text", { locale: "ca_ES" } );
		const sentenceLengthInTextAssessmentCatalan = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentCatalan.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for all short sentences in Catalan", function() {
		const mockPaper = new Paper( "text", { locale: "ca_ES" } );
		const sentenceLengthInTextAssessmentCatalan = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentCatalan.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for all short sentences in Polish", function() {
		const mockPaper = new Paper( "text", { locale: "pl_PL" } );
		const sentenceLengthInTextAssessmentPolish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPolish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Polish", function() {
		const mockPaper = new Paper( "text", { locale: "pl_PL" } );
		const sentenceLengthInTextAssessmentPolish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPolish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 10% long sentences in Polish", function() {
		const mockPaper = new Paper( "text", { locale: "pl_PL" } );
		const sentenceLengthInTextAssessmentPolish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPolish.getResult( mockPaper, Factory.buildMockResearcher( [
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
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in Polish", function() {
		const mockPaper = new Paper( "text", { locale: "pl_PL" } );
		const sentenceLengthInTextAssessmentPolish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPolish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 20% long sentences in Polish", function() {
		const mockPaper = new Paper( "text", { locale: "pl_PL" } );
		const sentenceLengthInTextAssessmentPolish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPolish.getResult( mockPaper, Factory.buildMockResearcher( [
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
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Portuguese", function() {
		const mockPaper = new Paper( "text", { locale: "pt_PT" } );
		const sentenceLengthInTextAssessmentPortuguese = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPortuguese.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Portuguese", function() {
		const mockPaper = new Paper( "text", { locale: "pt_PT" } );
		const sentenceLengthInTextAssessmentPortuguese = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPortuguese.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 25% long sentences in Portuguese", function() {
		const mockPaper = new Paper( "text", { locale: "pt_PT" } );
		const sentenceLengthInTextAssessmentPortuguese = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentPortuguese.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 24 },
			{ sentence: "", sentenceLength: 20 },
			{ sentence: "", sentenceLength: 27 },
			{ sentence: "", sentenceLength: 24 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Indonesian", function() {
		const mockPaper = new Paper( "text", { locale: "id_ID" } );
		const sentenceLengthInTextAssessmentSpanish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentSpanish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 25 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for all short sentences in Indonesian", function() {
		const mockPaper = new Paper( "text", { locale: "id_ID" } );
		const sentenceLengthInTextAssessmentSpanish = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentSpanish.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );


	it( "returns the score for 100% long sentences in Arabic", function() {
		const mockPaper = new Paper( "text", { locale: "ar_AR" } );
		const sentenceLengthInTextAssessmentArabic = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentArabic.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 25 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for all short sentences in Arabic", function() {
		const mockPaper = new Paper( "text", { locale: "ar_AR" } );
		const sentenceLengthInTextAssessmentArabic = new SentenceLengthInTextAssessment( contentConfiguration( mockPaper.getLocale() ).sentenceLength );

		const assessment = sentenceLengthInTextAssessmentArabic.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },

		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
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
		const sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?", sentenceLength: 21 } ] );
		const expected = [
			new Mark( { original: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?", marked: "<yoastmark class='yoast-text-mark'>This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?</yoastmark>" } ),
		];
		expect( sentenceLengthInTextAssessment.getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences are too long", function() {
		const paper = new Paper( "This is a short sentence." );
		const sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a short sentence.", sentenceLength: 5 } ] );
		const expected = [];
		expect( sentenceLengthInTextAssessment.getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );
} );

describe( "A test for marking too long sentences", function() {
	it( "calculatePercentage returns nothing if there are no sentences", function() {
		expect( sentenceLengthInTextAssessment.calculatePercentage( [] ) ).toEqual( 0 );
	} );
} );
