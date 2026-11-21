import innerText from "../../../src/parse/traverse/innerText";
import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../../src/helpers/factory";
import Node from "../../../src/parse/structure/Node";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import Paper from "../../../src/values/Paper";

let languageProcessor, paper;

beforeEach( () => {
	const researcher = Factory.buildMockResearcher( {}, true, false, false,
		{ memoizedTokenizer: memoizedSentenceTokenizer } );
	languageProcessor = new LanguageProcessor( researcher );
	paper = new Paper();
} );

describe( "A test for innerText", () => {
	it( "should correctly extract the inner text from a tree", function() {
		paper._text = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( paper, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree where the text contains markup", function() {
		paper._text = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( paper, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree if there is a subtree without text.", function() {
		paper._text = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, <div><div>yoast</div></div>! </p></div>";
		const tree = build( paper, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should consider break tags to be line breaks", function() {
		// Matsuo Bashō's "old pond".
		paper._text = "<p>old pond<br />frog leaps in<br>water's sound</p>";
		const tree = build( paper, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "old pond\nfrog leaps in\nwater's sound";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should return an empty string when presented an empty node", function() {
		const tree = new Node( "" );

		const searchResult = innerText( tree );
		const expected = "";

		expect( searchResult ).toEqual( expected );
	} );
} );
