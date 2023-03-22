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

		const expected = [
			{
				name: "p",
				isImplicit: false,
				attributes: { "class": new Set( [ "yoast" ] ) },
				childNodes: [ {
					name: "#text",
					value: "Hello, world! ",
				} ],
				sentences: [],
				sourceCodeLocation: {
					startOffset: 5,
					endOffset: 40,
					startTag: {
						startOffset: 5,
						endOffset: 22,
					},
					endTag: {
						startOffset: 36,
						endOffset: 40,
					},
				},
			},
			{
				name: "p",
				isImplicit: false,
				attributes: { "class": new Set( [ "yoast" ] ) },
				childNodes: [ {
					name: "#text",
					value: "Hello, yoast! ",
				} ],
				sentences: [],
				sourceCodeLocation: {
					startOffset: 40,
					endOffset: 75,
					startTag: {
						startOffset: 40,
						endOffset: 57,
					},
					endTag: {
						startOffset: 71,
						endOffset: 75,
					},
				},
			},
		];

		expect( searchResult ).toEqual( expected );
	} );

	it( "should return an empty result if the tag doesnt exist within the tree", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast! </p></div>";
		const tree = build( html, languageProcessor );

		const searchResult = findAllInTree( tree, treeNode => treeNode.name === "h1" );

		expect( searchResult ).toEqual( [] );
	} );
} );
