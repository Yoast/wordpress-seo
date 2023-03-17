import findAllInTree from "../../../src/parse/traverse/findAllInTree";
import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";

let languageProcessor;

beforeEach( () => {
	const researcher = Factory.buildMockResearcher( {} );
	languageProcessor = new LanguageProcessor( researcher );
} );

describe( "A test for findAllInTree", () => {
	it( "should correctly extract all p-tags from a tree", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = findAllInTree( tree, treeNode => treeNode.name === "p" );

		const expected =   [
			{
				attributes: { "class": new Set( [ "yoast" ] ) },
				childNodes: [
					{ name: "#text", value: "Hello, world! " },
				], isImplicit: false, name: "p", sentences: [],
			}, { attributes: { "class": new Set( [ "yoast" ] ) },
				childNodes: [
					{ name: "#text", value: "Hello, yoast! " },
				], isImplicit: false, name: "p", sentences: [],
			} ];

		expect( searchResult ).toEqual( expected );
	} );
	it( "should return an empty result if the tag doesnt exist within the tree", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = findAllInTree( tree, treeNode => treeNode.name === "h1" );

		expect( searchResult ).toEqual( [] );
	} );
} );
