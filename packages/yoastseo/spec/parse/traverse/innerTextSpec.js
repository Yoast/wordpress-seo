import innerText from "../../../src/parse/traverse/innerText";
import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";
import Node from "../../../src/parse/structure/Node";

describe( "A test for innerText", () => {
	it( "should correctly extract the inner text from a tree", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";

		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree, treeNode => treeNode.name === "p" );

		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree where the text contains markup", function() {
		const html = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, yoast! </p></div>";

		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree, treeNode => treeNode.name === "p" );

		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "should correctly extract the inner text from a tree there is a subtree without text.", function() {
		const html = "<div><p class='yoast'>Hello, <i>world!</i> </p><p class='yoast'>Hello, <div><div>yoast</div></div>! </p></div>";

		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );

		const searchResult = innerText( tree, treeNode => treeNode.name === "p" );

		const expected = "Hello, world! Hello, yoast! ";

		expect( searchResult ).toEqual( expected );
	} );

	it( "Should return an empty string when presented an empty node", function() {
		const tree = new Node( "" );

		const searchResult = innerText( tree, treeNode => treeNode.name === "p" );

		const expected = "";

		expect( searchResult ).toEqual( expected );
	} );
} );
