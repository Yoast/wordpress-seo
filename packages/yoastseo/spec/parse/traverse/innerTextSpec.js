import innerText from "../../../src/parse/traverse/innerText";
import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";
import Node from "../../../src/parse/structure/Node";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";

let languageProcessor;

beforeEach( () => {
	const researcher = Factory.buildMockResearcher( {}, true, false, false,
		{ memoizedTokenizer: memoizedSentenceTokenizer } );
	languageProcessor = new LanguageProcessor( researcher );
} );

describe( "A test for innerText", () => {
	it( "should correctly extract the inner text from a tree", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree where the text contains markup", function() {
		const html = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree if there is a subtree without text.", function() {
		const html = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, <div><div>yoast</div></div>! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree );
		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should return an empty string when presented an empty node", function() {
		const tree = new Node( "" );

		const searchResult = innerText( tree );
		const expected = "";

		expect( searchResult ).toEqual( expected );
	} );
} );
