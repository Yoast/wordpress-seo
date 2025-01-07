import getSentences from "../../../src/languageProcessing/researches/countSentencesFromText.js";
import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import buildTree from "../../specHelpers/parse/buildTree";

describe( "counts words in sentences from text", function() {
	it( "returns sentences with question mark", function() {
		const mockPaper = new Paper( "Hello. How are you? Bye" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 1 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 3 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with exclamation mark", function() {
		const mockPaper = new Paper( "Hello. How are you! Bye" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 1 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 3 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with many spaces", function() {
		const mockPaper = new Paper( "Hello.        How are you! Bye" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 1 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 3 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with html-tags, should only count words", function() {
		const mockPaper = new Paper( "This is a text <img src='https://example.com/image.jpg' alt='a bunch of words in an alt-tag' />" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 4 );
	} );
	it( "returns sentences with html-tags, should only count words", function() {
		const mockPaper = new Paper( "This is a text <img src='https://example.com/image.jpg' alt='a bunch of words in an alt-tag' />. Another sentence." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 4 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 2 );
	} );
	it( "should not count sentences inside elements we want to exclude from the analysis", function() {
		const mockPaper = new Paper( "This is a text. <code>With some code.</code>. Another sentence." );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 4 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 2 );
	} );
	it( "returns sentences with question mark in Japanese", function() {
		const mockPaper = new Paper( "雨が降っている。 いつ終わるの？ さようなら" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 8 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 7 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with exclamation mark", function() {
		const mockPaper = new Paper( "雨が降っている. いつ終わるの！さようなら" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 8 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 7 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with many spaces", function() {
		const mockPaper = new Paper( "雨が降っている。        いつ終わるの？ さようなら" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 8 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 7 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with html-tags, should count characters in Japanese", function() {
		const mockPaper = new Paper( "いつ終わるの <img src='image.jpg' alt='自分を大事にして下さい' />" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 6 );
	} );
	it( "returns sentences with html-tags, should count characters in Japanese", function() {
		const mockPaper = new Paper( "いつ終わるの <img src='http://domain.com/image.jpg' alt='自分を大事にして下さい' />. 春がやってきます。" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 7 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 9 );
	} );
} );
