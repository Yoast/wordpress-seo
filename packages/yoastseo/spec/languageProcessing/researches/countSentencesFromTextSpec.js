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
	it( "returns Japanese sentences ending with different punctuation marks; character count doesn't include punctuation", function() {
		const mockPaper = new Paper( "雨が降っている。いつ終わるの？わかった！さようなら" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 7 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 6 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 4 )
		expect( sentences[ 3 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns Japanese sentences with many spaces (2nd sentence with half-width, 1st and 3rd sentence with fullwidth spaces", function() {
		const mockPaper = new Paper( "雨　が　降っている。        いつ終わるの？　さようなら　" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 7);
		expect( sentences[ 1 ].sentenceLength ).toBe( 6 );
		expect( sentences[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns Japanese sentence with an HTML img tag; character count excludes the HTML and the text within", function() {
		const mockPaper = new Paper( "いつ終わるの <img src='http://domain.com/image.jpg' alt='自分を大事にして下さい' />？！" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 6 );
	} );
	it( "returns Japanese sentence with an embedded video; character count excludes the HTML", function() {
		const mockPaper = new Paper( "いつ終わるの<iframe width=\"420\" height=\"315\"" +
			"src=\"https://www.youtube.com/embed/tgbNymZ7vqY\"></iframe>。春がやってきます。" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentences = getSentences( mockPaper, mockResearcher );

		expect( sentences[ 0 ].sentenceLength ).toBe( 6 );
		expect( sentences[ 1 ].sentenceLength ).toBe( 8 );
	} );
} );
