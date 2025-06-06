import SentenceLengthInTextAssessment from "../../../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import Factory from "../../../../src/helpers/factory.js";
import buildTree from "../../../specHelpers/parse/buildTree";

import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import PolishResearcher from "../../../../src/languageProcessing/languages/pl/Researcher";
import RussianResearcher from "../../../../src/languageProcessing/languages/ru/Researcher";
import ItalianResearcher from "../../../../src/languageProcessing/languages/it/Researcher";
import TurkishResearcher from "../../../../src/languageProcessing/languages/tr/Researcher";
import japaneseConfig from "../../../../src/languageProcessing/languages/ja/config/sentenceLength";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

const shortSentenceDefault = "Word ".repeat( 18 ) + "word. ";
const longSentenceDefault = "Word ".repeat( 20 ) + "word. ";
const shortSentence15WordsLimit = "Word ".repeat( 13 ) + "word. ";
const longSentence15WordsLimit = "Word ".repeat( 15 ) + "word. ";

describe( "An assessment for sentence length", function() {
	it( "returns the score for all short sentences using the default config", function() {
		const mockPaper = new Paper( shortSentenceDefault );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns a good score if there is no text", function() {
		const mockPaper = new Paper( "" );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 50% long sentences using the default config", function() {
		const mockPaper = new Paper( shortSentenceDefault + longSentenceDefault );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"50% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences using the default config", function() {
		const mockPaper = new Paper( longSentenceDefault );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences using the default config", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault + shortSentenceDefault + shortSentenceDefault );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 30% long sentences using the default config", function() {
		const mockPaper = new Paper( longSentenceDefault.repeat( 3 ) + shortSentenceDefault.repeat( 7 ) );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"30% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences in a language that overrides the default recommended length config", function() {
		const mockPaper = new Paper( longSentence15WordsLimit );
		const mockResearcher = new RussianResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, new RussianResearcher( mockPaper ) ) ).toEqual( [
			new Mark( {
				position: {
					startOffset: 0,
					endOffset: 80,
					startOffsetBlock: 0,
					endOffsetBlock: 80,
					clientId: "",
					attributeId: "",
					isFirstSection: false,
				},
			} ),
		] );
	} );

	/* it( "returns the score for 100% long sentences in a language with the sentence length limit of 25 words", function() {
		const mockPaper = new Paper( longSentence25WordsLimit );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new ItalianResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 25 words, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, new ItalianResearcher( mockPaper ) ) ).toEqual( [
			new Mark( {
				original: "Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word " +
					"Word Word Word Word Word Word word.",
				marked: addMark( "Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word Word " +
					"Word Word Word Word Word Word Word Word Word word." ),
			} ),
		] );
	} );

	it( "returns the score for 100% short sentences in a language with the sentence length limit of 25 words", function() {
		const mockPaper = new Paper( shortSentence25WordsLimit );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new ItalianResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );*/

	/* it( "returns the score for 100% short sentences in a language that overrides the default with the maximum allowed percentage of long sentences of 15%", function() {
		const mockPaper = new Paper( shortSentenceDefault );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in a language with the maximum allowed percentage of long sentences of 15%", function() {
		const mockPaper = new Paper( longSentenceDefault );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 10% long sentences in a language with the maximum allowed percentage of long sentences of 15%", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 9 ) );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in a language with the maximum allowed percentage of long sentences of 15%", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 3 ) );
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );*/

	it( "returns the score for 20% long sentences in a language that overrides the default config" +
		" for maximum allowed percentage of long sentences", function() {
		const mockPaper = new Paper( longSentenceDefault.repeat( 4 ) + shortSentenceDefault.repeat( 16 ) );
		const mockResearcher = new PolishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in a language that overrides the default config for both recommended " +
		"maximum sentence length, and the maximum allowed percentage of long sentences", function() {
		const mockPaper = new Paper( longSentence15WordsLimit + shortSentence15WordsLimit.repeat( 3 ) );
		const mockResearcher = new TurkishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 15 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	/* it( "returns the score for 25% long sentences in Hebrew", function() {
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
	} );*/

	/* it( "returns the score for 100% short sentences in Turkish", function() {
		const mockPaper = new Paper();
		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 14 },
		], false, false, turkishConfig ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );*/

	it( "returns the score for 100% long sentences in a language that should count sentence length in characters (Japanese)", function() {
		const mockPaper = new Paper( "" );
		const mockResearcher = Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 41 },
		], false, false, japaneseConfig );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"100% of the sentences contain more than 40 characters, which is more than the recommended maximum of 25%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in a language that should count sentence length in characters (Japanese)", function() {
		const mockPaper = new Paper( "日本語では、完了の助動詞としては「つ」「ぬ」「たり」「り」が用いられた（「てけり」「にき」などの過去完了形も）。" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 25,
			farTooMany: 30,
		}, false, false ).getResult( mockPaper, mockResearcher );

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
} );

describe( "A test for getting the right scoring config", function() {
	it( "uses the default config if no language-specific config is available", function() {
		const defaultConfig = {
			countCharacters: false,
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
		const defaultConfigCornerstone = {
			countCharacters: false,
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
		}, true ).getLanguageSpecificConfig( new DefaultResearcher( mockPaper ) ) ).toEqual( defaultConfigCornerstone );
	} );
	it( "uses language-specific config if available", function() {
		const mockPaper = new Paper( "" );
		const researcher = new ItalianResearcher( mockPaper );
		expect( new SentenceLengthInTextAssessment().getLanguageSpecificConfig( researcher ) ).toEqual( {
			countCharacters: false,
			recommendedLength: 25,
			slightlyTooMany: 25,
			farTooMany: 30,
			urlCallToAction: "<a href='https://yoa.st/34w' target='_blank'>",
			urlTitle: "<a href='https://yoa.st/34v' target='_blank'>",
		} );
	} );
	it( "uses language-specific cornerstone config if available", function() {
		const mockPaper = new Paper( "" );
		expect( new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getLanguageSpecificConfig( new PolishResearcher( mockPaper ) ) ).toEqual( {
			countCharacters: false,
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
			countCharacters: false,
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
	/* it( "returns the score for 100% short sentences in a language with custom scoring config for cornerstone", function() {
		const mockPaper = new Paper( shortSentenceDefault );
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in a language with custom scoring config for cornerstone", function() {
		const mockPaper = new Paper( longSentenceDefault );
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );*/

	it( "returns the score for 25% long sentences in a language that overrides the default cornerstone configuration", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 3 ) );
		const mockResearcher = new PolishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	/* it( "returns the score for 20% long sentences in Polish using the cornerstone configuration", function() {
		const mockPaper = new Paper( longSentenceDefault.repeat( 4 ) + shortSentenceDefault.repeat( 16 ) );
		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, new PolishResearcher( mockPaper ) );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );*/

	it( "returns the score for 25% long sentences using the default cornerstone configuration", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 3 ) );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, mockResearcher );

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
		const mockPaper = new Paper( shortSentenceDefault );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, false, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in English using the product page configuration", function() {
		const mockPaper = new Paper( longSentenceDefault );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, false, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 20%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in English using the product page configuration", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 3 ) );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"25% of the sentences contain more than 20 words, which is more than the recommended maximum of 20%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% short sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper( shortSentenceDefault );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 100% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper( longSentenceDefault );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 100% of the sentences" +
			" contain more than 20 words, which is more than the recommended maximum of 15%. <a href='https://yoa.st/34w' target='_blank'>Try to" +
			" shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 20% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 4 ) );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, mockResearcher );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: " +
			"20% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%." +
			" <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences in English using the cornerstone product page configuration", function() {
		const mockPaper = new Paper( longSentenceDefault + shortSentenceDefault.repeat( 3 ) );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const assessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15,
			farTooMany: 20,
		}, true, true ).getResult( mockPaper, mockResearcher );

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
		const mockPaper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const expected = [
			new Mark( {
				position: {
					startOffset: 0,
					endOffset: 106,
					startOffsetBlock: 0,
					endOffsetBlock: 106,
					attributeId: "",
					clientId: "",
					isFirstSection: false,
				} } ),
		];
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, mockResearcher ) ).toEqual( expected );
	} );

	it( "adjusts the startOffset when the long sentence starts with a space", () => {
		const mockPaper = new Paper( " This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const expected = [
			new Mark( {
				position: {
					startOffset: 1,
					endOffset: 107,
					startOffsetBlock: 1,
					endOffsetBlock: 107,
					attributeId: "",
					clientId: "",
					isFirstSection: false,
				} } ),
		];
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, mockResearcher ) ).toEqual( expected );
	} );

	it( "adjusts the endOffset when the long sentence ends with a space", () => {
		const mockPaper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think? " );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const expected = [
			new Mark( {
				position: {
					startOffset: 0,
					endOffset: 106,
					startOffsetBlock: 0,
					endOffsetBlock: 106,
					attributeId: "",
					clientId: "",
					isFirstSection: false,
				} } ),
		];
		expect( new SentenceLengthInTextAssessment().getMarks( mockPaper, mockResearcher ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences are too long", function() {
		const paper = new Paper( "This is a short sentence." );
		// const sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a short sentence.", sentenceLength: 5 } ] );
		const mockResearcher = new EnglishResearcher( paper );
		buildTree( paper, mockResearcher );

		const expected = [];
		expect( new SentenceLengthInTextAssessment().getMarks( paper, mockResearcher ) ).toEqual( expected );
	} );
} );

describe( "A test for calculatePercentage", function() {
	it( "returns nothing if there are no sentences", function() {
		expect( new SentenceLengthInTextAssessment().calculatePercentage( [] ) ).toEqual( 0 );
	} );
} );
