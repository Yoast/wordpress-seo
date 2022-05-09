import getSentences from "../../../src/languageProcessing/researches/countSentencesFromText.js";
import Paper from "../../../src/values/Paper";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "counts words in sentences from text", function() {
	let paper;

	it( "returns sentences with question mark", function() {
		paper = new Paper( "Hello. How are you? Bye" );
		expect( getSentences( paper, new EnglishResearcher() )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper, new EnglishResearcher() )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper, new EnglishResearcher() )[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with exclamation mark", function() {
		paper = new Paper( "Hello. How are you! Bye" );
		expect( getSentences( paper, new EnglishResearcher() )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper, new EnglishResearcher() )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper, new EnglishResearcher() )[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with many spaces", function() {
		paper = new Paper( "Hello.        How are you! Bye" );
		expect( getSentences( paper, new EnglishResearcher() )[ 0 ].sentenceLength ).toBe( 1 );
		expect( getSentences( paper, new EnglishResearcher() )[ 1 ].sentenceLength ).toBe( 3 );
		expect( getSentences( paper, new EnglishResearcher() )[ 2 ].sentenceLength ).toBe( 1 );
	} );
	it( "returns sentences with html-tags, should only count words", function() {
		paper = new Paper( "This is a text <img src='image.jpg' alt='a bunch of words in an alt-tag' />" );
		expect( getSentences( paper, new EnglishResearcher() )[ 0 ].sentenceLength ).toBe( 4 );
	} );
	it( "returns sentences with html-tags, should only count words", function() {
		paper = new Paper( "This is a text <img src='http://domain.com/image.jpg' alt='a bunch of words in an alt-tag' />. Another sentence." );
		expect( getSentences( paper, new EnglishResearcher() )[ 0 ].sentenceLength ).toBe( 4 );
		expect( getSentences( paper, new EnglishResearcher() )[ 1 ].sentenceLength ).toBe( 2 );
	} );
	/*it( "returns sentences with question mark in Japanese", function() {
		paper = new Paper( "雨が降っている。 いつ終わるの？ さようなら" );
		expect( getSentences( paper, new JapaneseResearcher() )[ 0 ].sentenceLength ).toBe( 8 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 1 ].sentenceLength ).toBe( 7 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with exclamation mark", function() {
		paper = new Paper( "雨が降っている. いつ終わるの！さようなら" );
		expect( getSentences( paper, new JapaneseResearcher() )[ 0 ].sentenceLength ).toBe( 8 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 1 ].sentenceLength ).toBe( 7 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with many spaces", function() {
		paper = new Paper( "雨が降っている。        いつ終わるの？ さようなら" );
		expect( getSentences( paper, new JapaneseResearcher() )[ 0 ].sentenceLength ).toBe( 8 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 1 ].sentenceLength ).toBe( 7 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 2 ].sentenceLength ).toBe( 5 );
	} );
	it( "returns sentences with html-tags, should count characters in Japanese", function() {
		paper = new Paper( "いつ終わるの <img src='image.jpg' alt='自分を大事にして下さい' />" );
		expect( getSentences( paper, new JapaneseResearcher() )[ 0 ].sentenceLength ).toBe( 6 );
	} );
	it( "returns sentences with html-tags, should count characters in Japanese", function() {
		paper = new Paper( "いつ終わるの <img src='http://domain.com/image.jpg' alt='自分を大事にして下さい' />. 春がやってきます。" );
		expect( getSentences( paper, new JapaneseResearcher() )[ 0 ].sentenceLength ).toBe( 7 );
		expect( getSentences( paper, new JapaneseResearcher() )[ 1 ].sentenceLength ).toBe( 9 );
	} );*/
} );
