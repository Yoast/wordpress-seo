import Node from "../../../src/parse/structure/Node";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../../src/helpers/factory";
import build from "../../../src/parse/build/build";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import Paper from "../../../src/values/Paper";

describe( "A test for the Node object", () => {
	it( "should correctly create a simple Node object", function() {
		expect( new Node( "name", {}, [] ) ).toEqual( { name: "name", attributes: {}, childNodes: [] } );
	} );
} );

describe( "A test for the findAll method", () => {
	let paper;

	beforeEach( () => {
		paper = new Paper( "" );
	} );
	it( "should find all occurrences of a p tag", function() {
		paper._text = "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( paper, languageProcessor );

		const searchResult = tree.findAll( ( node ) => node.name === "p" );

		const expected = [ {
			name: "p",
			attributes: { "class": new Set( [ "yoast" ] ) },
			childNodes: [ { name: "#text", value: "Hello, world! ", sourceCodeRange: { startOffset: 22, endOffset: 36 } } ],
			isImplicit: false,
			sentences: [ {
				text: "Hello, world!",
				sourceCodeRange: { startOffset: 22, endOffset: 35 },
				tokens: [
					{ text: "Hello", sourceCodeRange: { startOffset: 22, endOffset: 27 } },
					{ text: ",", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
					{ text: " ", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
					{ text: "world", sourceCodeRange: { startOffset: 29, endOffset: 34 } },
					{ text: "!", sourceCodeRange: { startOffset: 34, endOffset: 35 } },
				],
			} ],
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
			attributes: { "class": new Set( [ "yoast" ] ) },
			childNodes: [ { name: "#text", value: "Hello, yoast!", sourceCodeRange: { startOffset: 57, endOffset: 70 } } ],
			isImplicit: false,
			sentences: [ {
				text: "Hello, yoast!",
				sourceCodeRange: { startOffset: 57, endOffset: 70 },
				tokens: [
					{ text: "Hello", sourceCodeRange: { startOffset: 57, endOffset: 62 } },
					{ text: ",", sourceCodeRange: { startOffset: 62, endOffset: 63 } },
					{ text: " ", sourceCodeRange: { startOffset: 63, endOffset: 64 } },
					{ text: "yoast", sourceCodeRange: { startOffset: 64, endOffset: 69 } },
					{ text: "!", sourceCodeRange: { startOffset: 69, endOffset: 70 } },
				],
			} ],
			sourceCodeLocation: {
				startOffset: 40,
				endOffset: 74,
				startTag: {
					startOffset: 40,
					endOffset: 57,
				},
				endTag: {
					startOffset: 70,
					endOffset: 74,
				},
			},
		} ];

		expect( searchResult ).toEqual( expected );
	} );
} );

describe( "A test for the innerText method", () => {
	it( "should return the inner text of a node", function() {
		const paper = new Paper( "<div><p class='yoast'>Hello, world! </p><p class='yoast'>Hello, yoast!</p></div>" );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		const tree = build( paper, languageProcessor );

		const innerText = tree.innerText();

		expect( innerText ).toEqual( "Hello, world! Hello, yoast!" );
	} );
} );
