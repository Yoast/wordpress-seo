/* eslint-disable capitalized-comments, spaced-comment */
import KeywordDensityAssessment from "../../../../src/scoring/assessments/seo/KeywordDensityAssessment";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../../src/languageProcessing/languages/de/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );
const morphologyDataDe = getMorphologyData( "de" );
// const morphologyDataJA = getMorphologyData( "ja" ); // Variable is used in language specific test (and thus removed)
const nonkeyword = "nonkeyword, ";
const keyword = "keyword, ";
const shortTextJapanese = "熱".repeat( 199 );
const longTextJapanese = "熱".repeat( 200 );
// const japaneseSentence = "私の猫はかわいいです。小さくて可愛い花の刺繍に関する一般一般の記事です。".repeat( 20 );   // Variable is used in language specific test (and thus removed)
// const japaneseSentenceWithKeyphrase = "一日一冊の面白い本を買って読んでるのはできるかどうかやってみます。";   // Variable is used in language specific test (and thus removed)
// const japaneseSentenceWithKeyphraseExactMatch = "一日一冊の本を読むのはできるかどうかやってみます。";   // Variable is used in language specific test (and thus removed)

describe( "Tests for the keywordDensity assessment for languages without morphology", function() {
	it( "runs the keywordDensity on the paper without keyword in the text", function() {
		const paper = new Paper( nonkeyword.repeat( 1000 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 5 times for a text of this length." +
			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a low keyphrase density (0.1%)", function() {
		const paper = new Paper( nonkeyword.repeat( 999 ) + keyword, { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 5 times for a text of this length." +
			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 995 ) + keyword.repeat( 5 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 5 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( nonkeyword.repeat( 980 ) + keyword.repeat( 20 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 965 ) + keyword.repeat( 35 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 35 times. That's more than the recommended maximum of 29 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density (10%)", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + keyword.repeat( 100 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 100 times. That's way more than the recommended maximum of 29 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );


	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - short keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 960 ) + "b c, ".repeat( 20 ), { keyword: "b c" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - long keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + "b c d e f, ".repeat( 20 ), { keyword: "b c d e f" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. That's way more than the recommended maximum of 12 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "returns a bad result if the keyword is only used once, regardless of the density", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ) + keyword, { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 2 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "returns a good result if the keyword is used twice and " +
		"the recommended count is smaller than or equal to 2, regardless of the density", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ) + "a b c, a b c", { keyword: "a b c", locale: "xx_XX" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 2 times. This is great!" );
	} );

	it( "applies to a paper with a keyword and a text of at least 100 words", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ), { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( true );
	} );

	it( "does not apply to a paper with text of 100 words but without a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ), { keyword: "" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "does not apply to a paper with a text containing less than 100 words and with a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 99 ), { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "does not apply to a paper with a text containing less than 100 words and without a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 99 ), { keyword: "" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "applies to a Japanese paper with a keyword and a text of at least 200 characters", function() {
		const paper = new Paper( longTextJapanese, { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new JapaneseResearcher( paper ) ) ).toBe( true );
	} );

	it( "does not apply to a Japanese paper with text of less than 200 characters", function() {
		const paper = new Paper( shortTextJapanese, { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper, new JapaneseResearcher( paper ) ) ).toBe( false );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology", function() {
	it( "gives a GOOD result when keyword density is between 3 and 3.5%", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. This is great!" );
	} );

	it( "gives a GOOD result when keyword density is between 3 and 3.5%, also for other languages with morphology support", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "de_DE" } );
		const researcher = new GermanResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataDe );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. This is great!" );
	} );

	it( "gives a BAD result when keyword density is between 3 and 3.5%, if morphology support is added, but there is no morphology data", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "de_DE" } );
		const researcher = new GermanResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. That's more than the recommended maximum of 29 times for a text of this length. " +
			"<a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );

describe( "A test for marking the keyword", function() {
	it( "returns markers", function() {
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const paper = new Paper( "This is a very interesting paper with a keyword and another keyword.", { keyword: "keyword" }  );
		const researcher = new DefaultResearcher( paper );
		keywordDensityAssessment.getResult( paper, researcher );
		const expected = [
			new Mark( {
				marked: "This is a very interesting paper with a " +
					"<yoastmark class='yoast-text-mark'>keyword</yoastmark> and another " +
					"<yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
				original: "This is a very interesting paper with a keyword and another keyword.",
			} ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );

	it( "returns markers for a keyphrase containing numbers", function() {
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const paper = new Paper( "This is the release of YoastSEO 9.3.", { keyword: "YoastSEO 9.3" }  );
		const researcher = new DefaultResearcher( paper );
		keywordDensityAssessment.getResult( paper, researcher );
		const expected = [
			new Mark( { marked: "This is the release of <yoastmark class='yoast-text-mark'>YoastSEO 9.3</yoastmark>.",
				original: "This is the release of YoastSEO 9.3." } ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );

	// it( "returns markers for a Japanese keyphrase enclosed in double quotes", function() {
	// 	const paper = new Paper( japaneseSentenceWithKeyphraseExactMatch.repeat( 3 ), {
	// 		keyword: "『一冊の本を読む』",
	// 		locale: "ja",
	// 	} );
	// 	const researcher = new JapaneseResearcher( paper );
	// 	const assessment = new KeywordDensityAssessment();
	// 	researcher.addResearchData( "morphology", morphologyDataJA );
	//
	// 	const result = assessment.getResult( paper, researcher );
	// 	const marks = [
	// 		new Mark( {
	// 			marked: "一日<yoastmark class='yoast-text-mark'>一冊の本を読む</yoastmark>のはできるかどうかやってみます。",
	// 			original: "一日一冊の本を読むのはできるかどうかやってみます。",
	// 		} ),
	// 		new Mark( {
	// 			marked: "一日<yoastmark class='yoast-text-mark'>一冊の本を読む</yoastmark>のはできるかどうかやってみます。",
	// 			original: "一日一冊の本を読むのはできるかどうかやってみます。",
	// 		} ),
	// 		new Mark( {
	// 			marked: "一日<yoastmark class='yoast-text-mark'>一冊の本を読む</yoastmark>のはできるかどうかやってみます。",
	// 			original: "一日一冊の本を読むのはできるかどうかやってみます。",
	// 		} ),
	// 	];
	//
	// 	expect( result.getScore() ).toBe( -50 );
	// 	expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
	// 		"The focus keyphrase was found 3 times." +
	// 		" That's way more than the recommended maximum of 2 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't" +
	// 		" overoptimize</a>!" );
	// 	expect( assessment.getMarks() ).toEqual( marks );
	// } );
} );
//
// describe( "A test for keyword density in Japanese", function() {
// 	it( "shouldn't return NaN/infinity times of keyphrase occurrence when the keyphrase contains only function words " +
// 		"and there is no match in the text", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 32 ), {
// 			keyword: "ばっかり",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 6 times for a text of this length. " +
// 			"<a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
//
// 	it( "shouldn't return NaN/infinity times of synonym occurrence when the synonym contains only function words " +
// 		"and there is no match in the text", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 32 ), {
// 			keyword: "",
// 			synonyms: "ばっかり",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 6 times for a text of this length. " +
// 			"<a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
//
// 	it( "shouldn't return NaN/infinity times of keyphrase occurrence when the keyphrase contains spaces " +
// 		"and there is no match in the text", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 32 ), {
// 			keyword: "かしら かい を ばっかり",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 6 times for a text of this length. " +
// 			"<a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
//
// 	it( "gives a very BAD result when keyword density is above 4% when the text contains way too many instances" +
// 		" of the keyphrase forms", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 32 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( -50 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 32 times. That's way more than the recommended maximum of 23 times for a text of " +
// 			"this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
// 	} );
//
// 	it( "gives a BAD result when keyword density is between 3% and 4% when the text contains too many instances" +
// 		" of the keyphrase forms", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 16 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( -10 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>:" +
// 			" The focus keyphrase was found 16 times. That's more than the recommended maximum of 15 times for a text of this length." +
// 			" <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
// 	} );
//
// 	it( "gives a BAD result when keyword density is 0", function() {
// 		const paper = new Paper( japaneseSentence, { keyword: "一冊の本を読む", locale: "ja" } );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 2 times for a text of this length." +
// 			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
//
// 	it( "gives a BAD result when keyword density is between 0 and 0.5%", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 1 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>:" +
// 			" The focus keyphrase was found 1 time. That's less than the recommended minimum of 2 times for a text of this length." +
// 			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
//
// 	it( "gives a GOOD result when keyword density is between 0.5% and 3.5% when the text contains keyphrase forms", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 8 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 9 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 8 times. This is great!" );
// 	} );
//
// 	it( "gives a GOOD result when keyword density is between 0.5% and 3%, when the exact match of the keyphrase is in the text", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphraseExactMatch.repeat( 8 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 9 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 8 times. This is great!" );
// 	} );
//
// 	it( "should still gives a GOOD result when keyword density is between 0.5% and 3%, when the exact match of the keyphrase is in the text " +
// 		"and the keyphrase is enclosed in double quotes", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphraseExactMatch.repeat( 8 ), {
// 			keyword: "「一冊の本を読む」",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		researcher.addResearchData( "morphology", morphologyDataJA );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 9 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 8 times. This is great!" );
// 	} );
//
// 	it( "gives a BAD result when keyword density is between 0.5% and 3.5%, if morphology is added, but there is no morphology data", function() {
// 		const paper = new Paper( japaneseSentence + japaneseSentenceWithKeyphrase.repeat( 8 ), {
// 			keyword: "一冊の本を読む",
// 			locale: "ja",
// 		} );
// 		const researcher = new JapaneseResearcher( paper );
// 		const result = new KeywordDensityAssessment().getResult( paper, researcher );
// 		expect( result.getScore() ).toBe( 4 );
// 		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
// 			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 2 times for a text of this length." +
// 			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
// 	} );
// } );
//
