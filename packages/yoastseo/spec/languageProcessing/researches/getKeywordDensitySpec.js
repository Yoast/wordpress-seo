import getKeywordDensity from "../../../src/languageProcessing/researches/getKeywordDensity.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );
const morphologyDataEN = getMorphologyData( "en" );


describe( "Test for counting the keyword density in a text", function() {
	// eslint-disable-next-line max-statements
	it( "returns keyword density", function() {
		let mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%", { keyword: "keyword" } );
		let mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 7.6923076923076925 );

		mockPaper = new Paper( "a string of text without the keyword in it, density should be 0%", { keyword: "empty" } );
		mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );

		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", { keyword: "äöüß" } );
		mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 9.090909090909092 );

		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit ", { keyword: "key-word" } );
		mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 9.090909090909092 );

		mockPaper = new Paper( "a string of text with the kapaklı in it, density should be 7.7%", { keyword: "kapaklı" } );
		mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );

		mockPaper = new Paper( "a string of text with the key-word in it, density should be 7.7%", { keyword: "key-word" } );
		mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 7.7%", { keyword: "key_word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 0.0%", { keyword: "key word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 7.7%", { keyword: "key word" } );
		// This behavior might change in the future.
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key&word in it, density should be 7.7%", { keyword: "key&word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "<img src='http://image.com/image.png'>", { keyword: "key&word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
		// Consecutive keywords are skipped, so this will match 2 times.
		mockPaper = new Paper( "This is a nice string with a keyword keyword keyword.", { keyword: "keyword" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 20 );
		mockPaper = new Paper( "a string of text with the $keyword in it, density should be 7.7%", { keyword: "$keyword" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the Keyword in it, density should be 7.7%", { keyword: "keyword" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the Key word in it, density should be 14.29%", { keyword: "key word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.142857142857142 );
		mockPaper = new Paper( "a string with quotes to match the key'word, even if the quotes differ", { keyword: "key’word" } );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );
} );

describe( "test for counting the keyword density in a text in a language that we haven't supported yet", function() {
	it( "returns keyword density", function() {
		const mockPaper = new Paper( "Ukara sing isine cemeng.", { keyword: "cemeng" } );
		expect( getKeywordDensity( mockPaper, new DefaultResearcher( mockPaper ) ) ).toBe( 25 );
	} );
} );

describe( "test for counting the keyword density in a text in a language that uses a custom getWords helper (Japanese)", function() {
	/*it( "returns keyword density when the keyword is not found in the sentence", function() {
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 0 );
	} );*/

	it( "returns the keyword density when the keyword is found once", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 16.666666666666664 );
	} );

	it( "returns the keyword density when the keyword contains multiple words and the sentence contains an inflected form", function() {
		// 小さく is the inflected form of 小さい.
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。", { keyword: "小さい花の刺繍" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 6.666666666666667 );
	} );

	/*it( "returns the keyword density when the morphologyData is not available to detect inflected forms", function() {
		// 小さく is the inflected form of 小さい.
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。", { keyword: "小さい花の刺繍" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 0 );
	} );

	it( "returns the keyword density when the keyword contains multiple words with an exact match separated in the sentence", function() {
		const mockPaper = new Paper( "一日一冊の面白い本を買って読んでるのはできるかどうかやってみます。", { keyword: "一冊の本を読む" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 5 );
	} );

	it( "returns the keyword density when the keyword contains multiple words with an exact match in the sentence", function() {
		const mockPaper = new Paper( "一日一冊の本を読むのはできるかどうかやってみます。", { keyword: "一冊の本を読む" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 6.666666666666667 );
	} );

	it( "returns 0 when the text is empty", function() {
		const mockPaper = new Paper( "", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 0 );
	} );*/
} );


