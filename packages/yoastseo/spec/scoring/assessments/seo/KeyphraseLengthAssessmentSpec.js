import KeyphraseLengthAssessment from "../../../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
import { all as englishFunctionWords } from "../../../../src/languageProcessing/languages/en/config/functionWords";
import { all as germanFunctionWords } from "../../../../src/languageProcessing/languages/de/config/functionWords";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

describe( "the keyphrase length assessment", function() {
	it( "should assess a custom paper with one-word keyphrase as bad ", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 1, functionWords: englishFunctionWords } );
		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 content word. That's shorter than the recommended minimum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );
	it( "should assess a custom paper with a slightly too short keyphrase as okay ", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 3, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 3 content words. That's slightly shorter than the recommended minimum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );

	it( "should assess a paper with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 4, functionWords: englishFunctionWords } );
		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a custom paper with a keyphrase that's slightly too long as okay", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 7, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 7 content words. That's longer than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a custom paper with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 9, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 content words. That's longer than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );
describe( "the keyphrase length assessment", function() {
	it( "should assess a language-specific custom paper with one-word keyphrase as bad ", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 1, functionWords: germanFunctionWords }, false,
			true );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 content word. That's shorter than the recommended minimum of 3 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );
	it( "should assess a custom paper with a slightly too short keyphrase as okay ", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 2, functionWords: germanFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 2 content words. That's slightly shorter than the recommended minimum of 3 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );
	it( "should assess a paper with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 3, functionWords: germanFunctionWords } );
		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );
	it( "should assess a custom paper with a keyphrase that's slightly too long as okay", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 7, functionWords: germanFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 7 content words. That's longer than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a custom paper with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 9, functionWords: germanFunctionWords } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 content words. That's longer than the recommended maximum of 6 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );

describe( "the keyphrase length assessment", function() {
	it( "should assess a paper without a keyword as extremely bad", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 0, functionWords: [] } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"No focus keyphrase was set for this page. " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );
	it( "should assess a paper without a keyword as extremely bad", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 0, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"No focus keyphrase was set for this page. " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should assess a product page without a keyword as extremely bad", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 0, functionWords: [] } );

		const result = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"No focus keyphrase was set for this page. " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should show a different feedback text when no keyphrase is set for a related keyphrase", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 0, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ).getResult( paper, researcher );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"<a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should assess the related keyphrase analysis of a product page with no keyphrase as extremely bad", function() {
		const paper = new Paper();
		const researcher = factory.buildMockResearcher( { keyphraseLength: 0, functionWords: [] } );

		const result = new KeyphraseLengthAssessment( { isRelatedKeyphrase: true,
			parameters: {
				recommendedMinimum: 3,
				recommendedMaximum: 6,
				acceptableMaximum: 7,
				acceptableMinimum: 1,
			},
		}, true ).getResult( paper, researcher );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>:" +
			" <a href='https://yoa.st/33j' target='_blank'>Set a keyphrase in order to calculate your SEO score</a>." );
	} );

	it( "should assess a paper with a keyphrase that's too long as bad", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 11, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 11 content words. That's way more than the recommended maximum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with a keyphrase that's the correct length", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 3, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );

	it( "should assess a paper with a keyphrase that's a little longer than the correct length", function() {
		const paper = new Paper( "", { keyword: "keyword keyword keyword keyword keyword" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 5, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 5 content words. That's more than the recommended maximum of 4 content words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );

	it( "should assess a paper with an 6-word keyphrase as good for a language that doesn't support function words", function() {
		const paper = new Paper( "", { keyword: "1 2 3 4 5 6" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 5, functionWords: [] } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );
	it( "should assess a paper with an 9-word keyphrase as okay for a language that doesn't support function words", function() {
		const paper = new Paper( "", { keyword: "1 2 3 4 5 6 7 8 9" } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 9, functionWords: [] } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 9 words. That's more than the recommended maximum of 6 words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a paper with a keyphrase in quotation marks and return string with 'words' instead of 'content words'", function() {
		const paper = new Paper( "", { keyword: '"I am lost in space"' } );
		const researcher = factory.buildMockResearcher( { keyphraseLength: 5, functionWords: englishFunctionWords } );

		const result = new KeyphraseLengthAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 5 words. That's more than the recommended maximum of 4 words. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a paper with a good length keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "猫" } );

		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );
	it( "should assess a paper with a slightly too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すた" } );

		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 18 characters. That's more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a paper with a too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すために" } );

		const result = new KeyphraseLengthAssessment().getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 20 characters. That's way more than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a paper with a good length keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "犬と猫とハムスター" } );

		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!" );
	} );
	it( "should assess a paper with a slightly too short keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "モルモット" } );

		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 5 characters. That's slightly shorter than the recommended minimum of 8 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );
	it( "should assess a paper with a too short keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "猫" } );

		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 1 character. That's shorter than the recommended minimum of 8 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it longer</a>!" );
	} );
	it( "should assess a paper with a slightly too long keyphrase for a product page in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すた" } );

		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 18 characters. That's longer than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
	it( "should assess a paper with a too long keyphrase in Japanese", function() {
		const paper = new Paper( "", { keyword: "他の記事執筆者へ執筆の参考例を示すために" } );

		const result = new KeyphraseLengthAssessment( {}, true ).getResult( paper, new JapaneseResearcher( paper ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: " +
			"The keyphrase contains 20 characters. That's longer than the recommended maximum of 12 characters. " +
			"<a href='https://yoa.st/33j' target='_blank'>Make it shorter</a>!" );
	} );
} );
