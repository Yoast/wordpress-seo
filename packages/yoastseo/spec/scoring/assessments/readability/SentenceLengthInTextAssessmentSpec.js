import { merge } from "lodash-es";

import SentenceLengthInTextAssessment from "../../../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";

import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import addMark from "../../../../src/markers/addMark";
import Factory from "../../../specHelpers/factory.js";

import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import PolishResearcher from "../../../../src/languageProcessing/languages/pl/Researcher";
import ItalianResearcher from "../../../../src/languageProcessing/languages/it/Researcher";

import catalanConfig from "../../../../src/languageProcessing/languages/ca/config/sentenceLength";
import spanishConfig from "../../../../src/languageProcessing/languages/es/config/sentenceLength";
import hebrewConfig from "../../../../src/languageProcessing/languages/he/config/sentenceLength";
import italianConfig from "../../../../src/languageProcessing/languages/it/config/sentenceLength";
import japaneseConfig from "../../../../src/languageProcessing/languages/ja/config/sentenceLength";
import russianConfig from "../../../../src/languageProcessing/languages/ru/config/sentenceLength";
import polishConfig from "../../../../src/languageProcessing/languages/pl/config/sentenceLength";
import portugueseConfig from "../../../../src/languageProcessing/languages/pt/config/sentenceLength";
import turkishConfig from "../../../../src/languageProcessing/languages/tr/config/sentenceLength";

// eslint-disable-next-line max-statements
describe( "An assessment for sentence length", function() {
	it( "returns the score for all short sentences using the default config", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ) );

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
		] ) );

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
		] ) );

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
		] ) );

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
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"30% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Russian", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		], false, false, russianConfig ) );

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
	it( "returns the score for 100% long sentences in Italian", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, italianConfig ) );

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
		], false, false, italianConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Spanish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, spanishConfig ) );

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
		], false, false, spanishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Catalan", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 26 },
		], false, false, catalanConfig ) );

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
		], false, false, catalanConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% short sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },
		], false, false, polishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Polish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		], false, false, polishConfig ) );

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
		], false, false, polishConfig ) );

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
		], false, false, polishConfig ) );

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
		], false, false, polishConfig ) );

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
		], false, false, portugueseConfig ) );

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
		], false, false, portugueseConfig ) );

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
		], false, false, portugueseConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Hebrew", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
		], false, false, hebrewConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in Hebrew", function() {
		const mockPaper = new Paper( "text", { locale: "he_IL" } );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 16 },
			{ sentence: "", sentenceLength: 15 },
			{ sentence: "", sentenceLength: 15 },
			{ sentence: "", sentenceLength: 15 },
		], false, false, hebrewConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Hebrew", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, hebrewConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% short sentences in Turkish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, turkishConfig ) );

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
		], false, false, turkishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 15 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in Japanese", function() {
		const mockPaper = new Paper( "" );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 41 },
		], false, false, japaneseConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		// Update words to characters in LINGO-1109
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 40 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in Japanese", function() {
		const mockPaper = new Paper( "" );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 39 },
		], false, false, japaneseConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 25% long sentences in Japanese", function() {
		const mockPaper = new Paper( "" );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 39 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 42 },
			{ sentence: "", sentenceLength: 38 },
		], false, false, japaneseConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );


	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for getting the right config", function() {
	it( "uses the default config if no language-specific config is available", function() {
		const defaultConfig = {
			recommendedLength: 20,
			slightlyTooMany: 25,
			farTooMany: 30,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>",
		};
		const mockPaper = new Paper( "" );
		expect( new SentenceLengthInTextAssessment().getLanguageSpecificConfig( new DefaultResearcher( mockPaper ) ) ).toEqual( defaultConfig );
	} );
	it( "uses the default config if no language-specific config is available in cornerstone", function() {
		const defaultConfigCornerstrone = {
			recommendedLength: 20,
			slightlyTooMany: 20,
			farTooMany: 25,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>",
		};
		const mockPaper = new Paper( "" );
		expect( new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getLanguageSpecificConfig( new DefaultResearcher( mockPaper ) ) ).toEqual( defaultConfigCornerstrone );
	} );
	it( "uses language-specific config if available", function() {
		const mockPaper = new Paper( "" );
		const researcher = new ItalianResearcher( mockPaper );
		const config = merge( italianConfig, {
			slightlyTooMany: 25,
			farTooMany: 30,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>" } );
		expect( new SentenceLengthInTextAssessment().getLanguageSpecificConfig( researcher ) ).toEqual( config );
	} );
	it( "uses language-specific cornerstone config if available", function() {
		const mockPaper = new Paper( "" );
		expect( new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getLanguageSpecificConfig( new PolishResearcher( mockPaper ) ) ).toEqual( {
			farTooMany: 20,
			recommendedLength: 20,
			slightlyTooMany: 15,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>",
		} );
	} );
	it( "uses a combination of language-specific and default config in cornerstone if there is regular but not cornerstone config" +
		" available", function() {
		const expectedConfig = {
			recommendedLength: 25,
			slightlyTooMany: 20,
			farTooMany: 25,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>",
		};
		const mockPaper = new Paper( "" );
		expect( new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getLanguageSpecificConfig( new ItalianResearcher( mockPaper ) ) ).toEqual( expectedConfig );
	} );
} );

describe( "An assessment for sentence length for cornerstone content", function() {
	it( "returns the score for 100% short sentences in Polish using the cornerstone configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },
		], false, false, polishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in Polish using the cornerstone configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		], false, false, polishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in Polish using the cornerstone configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		], false, false, polishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 20% long sentences in Polish using the cornerstone configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
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
		], false, false, polishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences using the default cornerstone configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 25 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "An assessment for sentence length for product pages", function() {
	it( "returns the score for 100% short sentences in English using the product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, false, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in English using the product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, false, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 20%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in English using the product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 19 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 20% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 21 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "A test for marking too long sentences", function() {
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
		expect( new SentenceLengthInTextAssessment().calculatePercentage( [] ) ).toEqual( 0 );
	} );
} );
