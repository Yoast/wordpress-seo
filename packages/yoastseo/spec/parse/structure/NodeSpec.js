import Node from "../../../src/parse/structure/Node";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";
import build from "../../../src/parse/build/build";

describe( "A test for the Node object", () => {
	it( "should correctly create a simple Node object", function() {
		expect( new Node( "name", {}, [] ) ).toEqual( { name: "name", attributes: {}, childNodes: [] } );
	} );
} );

describe( "A test for the findAll method", () => {
	it( "should find all occurrences of a p tag", function() {
		const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast!</p></div>";

		const researcher = Factory.buildMockResearcher( {} );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( html, languageProcessor );

		const searchResult = tree.findAll( ( node ) => node.name === "p" );

		const expected = [ {
			name: "p",
			attributes: { "class": new Set( [ "yoast" ] ) },
			childNodes: [ { name: "#text", value: "Hello, world! " } ],
			isImplicit: false,
			sentences: [],
		},
		{
			name: "p",
			attributes: { "class": new Set( [ "yoast" ] ) },
			childNodes: [ { name: "#text", value: "Hello, yoast!" } ],
			isImplicit: false,
			sentences: [],
		} ];

		expect( searchResult ).toEqual( expected );
	} );
} );

describe( "A test for the innerText method", () => {
	const html = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast!</p></div>";

	const researcher = Factory.buildMockResearcher( {} );
	const languageProcessor = new LanguageProcessor( researcher );

	const tree = build( html, languageProcessor );

	const innerText = tree.innerText();

	expect( innerText ).toEqual( "Hello, world! Hello, yoast!" );
} );
