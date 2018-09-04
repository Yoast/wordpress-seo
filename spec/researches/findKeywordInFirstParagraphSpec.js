import firstParagraph from "../../src/researches/findKeywordInFirstParagraph.js";
import Paper from "../../src/values/Paper.js";


describe( "checks for the keyword in the first paragraph", function() {
	it( "returns the number of matches", function() {
		expect( firstParagraph( new Paper( "<p>keyword</p>", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>text</p> keyword", { keyword: "keyword" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p>test</p><p>keyword</p>", { keyword: "keyword" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper(  "dit is een keyword test \n\n ", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "keyword\n\ntext", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "dit is een test \n\n keyword", { keyword: "keyword" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "dit is een test keyword", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p class='p'>keyword</p>", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<table><tr><td>keyword</td></tr></table>", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a kapaklı</p>", { keyword: "kapaklı" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key-word</p>", { keyword: "key-word" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key-word</p>", { keyword: "key_word" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p>this is a key_word</p>", { keyword: "key_word" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key_word</p>", { keyword: "key word" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p>this is a $keyword with an extra char</p>", { keyword: "$keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>Bu yıldız, Vikipedi'deki seçkin içeriği sembolize eder İstanbul.</p>", { keyword: "İstanbul", locale: "tr_TR" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>äbc und Äbc</p>", { keyword: "äbc", locale: "de_DE" } ) ) ).toBe( 2 );
	} );
} );

// Empty paragraphs can occur when there are only shortcodes that are filtered out.
describe( "The first paragraph should be skipped when it is empty.", function() {
	it( "returns the number of matches in the first not empty paragraph",  function() {
		expect( firstParagraph( new Paper( "<p></p><p>this is a keyword</p>", { keyword: "keyword" } ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p></p><p>this is a keyword</p>", { keyword: "" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p></p>", { keyword: "keyword" } ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p></p><p>Not an empty paragraph</p><p>This is a keyword</p>", { keyword: "keyword" } ) ) ).toBe( 0 );
	} );
} );


