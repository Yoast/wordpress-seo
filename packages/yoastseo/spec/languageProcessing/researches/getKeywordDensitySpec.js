import getKeywordDensity from "../../../src/languageProcessing/researches/getKeywordDensity.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import TurkishResearcher from "../../../src/languageProcessing/languages/tr/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import buildTree from "../../specHelpers/parse/buildTree";

const morphologyDataJA = getMorphologyData( "ja" );
const morphologyDataEN = getMorphologyData( "en" );

describe( "Test for counting the keyword density in a text with an English researcher", function() {
	it( "should return a correct non-zero value if the text contains the keyword", function() {
		const mockPaper = new Paper( "<p>a string of text with the keyword in it, density should be 7.7%</p>", { keyword: "keyword" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 7.6923076923076925 );
	} );

	it( "should return zero if the keyphrase does not occur in the text.", function() {
		const mockPaper = new Paper( "<p>a string of text without the keyword in it, density should be 0%</p>", { keyword: "empty" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
	} );


	it( "should recognize a keyphrase when it consists umlauted characters", function() {
		const mockPaper = new Paper( "<p>Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.</p>", { keyword: "äöüß" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		buildTree( mockPaper, mockResearcher );

		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 9.090909090909092 );
	} );

	it( "should recognize a hyphenated keyphrase.", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit</p>", { keyword: "key-word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology",  morphologyDataEN );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 16.666666666666664 );
	} );

	it( "should recognize a keyphrase with an underscore in it", function() {
		const mockPaper = new Paper( "<p>a string of text with the key_word in it, density should be 7.7%</p>", { keyword: "key_word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );

	it( "should return zero if a multiword keyphrase is not present but the multiword keyphrase occurs with an underscore", function() {
		const mockPaper = new Paper( "<p>a string of text with the key_word in it, density should be 0.0%</p>", { keyword: "key word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
	} );

	it( "should recognize a multiword keyphrase when it occurs hyphenated", function() {
		const mockPaper = new Paper( "<p>a string of text with the key-word in it, density should be 7.7%</p>", { keyword: "key word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );

		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.142857142857142 );
	} );

	it( "should recognize a keyphrase with an ampersand in it", function() {
		const mockPaper = new Paper( "<p>a string of text with the key&word in it, density should be 7.7%</p>", { keyword: "key&word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );

	it( "should include all keyphrase occurrence if there are more than two consecutive", function() {
		const mockPaper = new Paper( "<p>This is a nice string with a keyword keyword keyword keyword keyword keyword keyword keyword keyword.</p>",
			{ keyword: "keyword" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 56.25 );
	} );

	it( "should recognize a keyphrase with a '$' in it", function() {
		const mockPaper = new Paper( "<p>a string of text with the $keyword in it, density should be 7.7%</p>", { keyword: "$keyword" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );

	it( "should recognize a keyphrase regardless of capitalization", function() {
		const mockPaper = new Paper( "<p>a string of text with the Keyword in it, density should be 7.7%</p>", { keyword: "keyword" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );

	it( "should recognize a multiword keyphrase regardless of capitalization", function() {
		const mockPaper = new Paper( "<p>a string of text with the Key word in it, density should be 14.29%</p>", { keyword: "key word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.142857142857142 );
	} );

	it( "should recognize apostrophes regardless of the type of quote that was used", function() {
		const mockPaper = new Paper( "<p>a string with quotes to match the key'word, even if the quotes differ</p>", { keyword: "key’word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );
	it( "should recognize keyphrase separated by &nbsp;", function() {
		const mockPaper = new Paper( "<p>a string with non-breaking space to match the key&nbsp;word</p>", { keyword: "key word" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 9.090909090909092 );
	} );
	it( "should return 0 when the paper contains only excluded element", function() {
		const mockPaper = new Paper( "<blockquote>In the United States and parts of Europe, " +
			"tortoiseshell cats are often considered lucky charms.</blockquote>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
	} );
	it( "should return 0 when the paper is empty", function() {
		const mockPaper = new Paper( "" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
	} );
} );

describe( "test for counting the keyword density in a non-English and non-Japanese language", function() {
	it( "returns keyword density for a language that we haven't had the support yet", function() {
		const mockPaper = new Paper( "Ukara sing isine cemeng.", { keyword: "cemeng", locale: "jv_ID" } );
		const mockResearcher = new DefaultResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 25 );
	} );
	it( "should correctly recognize a Turkish transliterated keyphrase with a 'ı' in it", function() {
		const mockPaper = new Paper( "a string of text with the kapakli in it, density should be 7.7%</p>", { keyword: "kapaklı", locale: "tr_TR" } );
		const mockResearcher = new TurkishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 7.6923076923076925 );
	} );
} );

describe( "test for counting the keyword density in a text in a language that uses a custom getWords helper (Japanese)", function() {
	it( "returns keyword density when the keyword is not found in the sentence", function() {
		const mockPaper = new Paper( "<p>小さくて可愛い花の刺繍に関する一般一般の記事です。</p>", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		buildTree( mockPaper, mockResearcher );

		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 0 );
	} );

	it( "returns the keyword density when the keyword is found once", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいいです。</p>", { keyword: "猫" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		buildTree( mockPaper, mockResearcher );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 16.666666666666664 );
	} );

	it( "returns the keyword density when the keyword contains multiple words and the sentence contains an inflected form", function() {
		// 小さく is the inflected form of 小さい.
		const mockPaper = new Paper( "<p>小さくて可愛い花の刺繍に関する一般一般の記事です。</p>", { keyword: "小さい花の刺繍" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 6.666666666666667 );
	} );

	it( "returns the keyword density when the keyword contains multiple words with an exact match in the sentence", function() {
		const mockPaper = new Paper( "<p>一日一冊の本を読むのはできるかどうかやってみます。</p>", { keyword: "『一冊の本を読む』" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		buildTree( mockPaper, mockResearcher );

		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 6.666666666666667 );
	} );
} );


