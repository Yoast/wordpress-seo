import getTextElementPositions from "../../../../src/parse/build/private/getTextElementPositions";
import Paragraph from "../../../../src/parse/structure/Paragraph";
import Heading from "../../../../src/parse/structure/Heading";
import Token from "../../../../src/parse/structure/Token";
import { parseFragment } from "parse5";
import adapt from "../../../../src/parse/build/private/adapt";

describe( "A test for getting positions of sentences", () => {
	it( "gets the sentence positions from a node that doesn't have descendants other than the Text node", function() {
		// HTML: <p>Hello, world! Hello, yoast!</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" } ],
			{
				startOffset: 5,
				endOffset: 39,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 35,
					endOffset: 39,
				},
			} );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const sentencesWithPositions = [ { text: "Hello, world!", sourceCodeRange: { startOffset: 8, endOffset: 21 } },
			{ text: " Hello, yoast!", sourceCodeRange: { startOffset: 21, endOffset: 35 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "gets the token and sentence positions from a node that has a `span` descendant node", function() {
		// HTML: <p>Hello, <span>world!</span> Hello, yoast!</p>.
		const html = "<p>Hello, <span>world!</span> Hello, yoast!</p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!", " ", "Hello", ",", " ", "yoast", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang, space2, hello2, comma2, space3, yoast, bang2 ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 8, endOffset: 9 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 10 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 21 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 21, endOffset: 22 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 30 } );
		expect( hello2.sourceCodeRange ).toEqual( { startOffset: 30, endOffset: 35 } );
		expect( comma2.sourceCodeRange ).toEqual( { startOffset: 35, endOffset: 36 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 36, endOffset: 37 } );
		expect( yoast.sourceCodeRange ).toEqual( { startOffset: 37, endOffset: 42 } );
		expect( bang2.sourceCodeRange ).toEqual( { startOffset: 42, endOffset: 43 } );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const [ helloSentence, yoastSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 22 } );
		expect( yoastSentence.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 43 } );
	} );

	it( "should get the correct token and sentence positions when an entire sentence is in between span tags", function() {
		// HTML: <p><span>Hello, world!</span></p>.

		const html = "<p><span>Hello, world!</span></p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 14 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 14, endOffset: 15 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 16 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 21 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 21, endOffset: 22 } );

		const sentences = [ { text: "Hello, world!" } ];
		const [ helloSentence ] = getTextElementPositions( paragraph, sentences );

		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 22 } );
	} );

	it( "gets the token and sentence positions from a node that has a descendant node without a closing tag (img)", function() {
		// HTML: <p>Hello, world!<img src="image.jpg" alt="this is an image" width="500" height="600"> Hello, yoast!</p>
		const html = "<p>Hello, world!<img src=\"image.jpg\" alt=\"this is an image\" width=\"500\" height=\"600\"> Hello, yoast!</p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!", " ", "Hello", ",", " ", "yoast", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang, space2, hello2, comma2, space3, yoast, bang2 ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 8, endOffset: 9 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 10 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 10, endOffset: 15 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 16 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 85, endOffset: 86 } );
		expect( hello2.sourceCodeRange ).toEqual( { startOffset: 86, endOffset: 91 } );
		expect( comma2.sourceCodeRange ).toEqual( { startOffset: 91, endOffset: 92 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 92, endOffset: 93 } );
		expect( yoast.sourceCodeRange ).toEqual( { startOffset: 93, endOffset: 98 } );
		expect( bang2.sourceCodeRange ).toEqual( { startOffset: 98, endOffset: 99 } );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const [ helloSentence, yoastSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 16 } );
		expect( yoastSentence.sourceCodeRange ).toEqual( { startOffset: 85, endOffset: 99 } );
	} );

	it( "gets the sentence positions from a node that has a `span` and an `em` descendant node", function() {
		// HTML: <p>Hello, <span>world!</span> Hello, <em>yoast!</em></p>.
		// It is decided as follows: The following sentence boundaries:
		// Sentences:
		// <p>|Hello, <span>world!|</span>| Hello, <em>yoast!|</em></p>.
		//    ^ start             ^ end   ^ start            ^ end
		// Tokens:
		// <p>|Hello|,| |<span>|world|!|</span>| |Hello|,| |<em>|yoast|!|</em>|</p>.

		const html = "<p>Hello, <span>world!</span> Hello, <em>yoast!</em></p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!", " ", "Hello", ",", " ", "yoast", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang, space2, hello2, comma2, space3, yoast, bang2 ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 8, endOffset: 9 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 10 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 21 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 21, endOffset: 22 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 30 } );
		expect( hello2.sourceCodeRange ).toEqual( { startOffset: 30, endOffset: 35 } );
		expect( comma2.sourceCodeRange ).toEqual( { startOffset: 35, endOffset: 36 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 36, endOffset: 37 } );
		expect( yoast.sourceCodeRange ).toEqual( { startOffset: 41, endOffset: 46 } );
		expect( bang2.sourceCodeRange ).toEqual( { startOffset: 46, endOffset: 47 } );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const [ helloSentence, yoastSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 22 } );
		expect( yoastSentence.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 47 } );
	} );

	it( "gets the sentence positions from a node that has a `span` and an `em` descendant node when the em-tags are directly bordering a word ",
		function() {
		// HTML: <p>Hello, <span>world!</span> Hello, <em>yoast</em>!</p>.
			const html = "<p>Hello, <span>world!</span> Hello, <em>yoast</em>!</p>";
			const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
			const paragraph = tree.childNodes[ 0 ];
			const tokens = [ "Hello", ",", " ", "world", "!", " ", "Hello", ",", " ", "yoast", "!" ].map( string => new Token( string ) );

			const [ hello, comma, space, world, bang, space2, hello2, comma2, space3, yoast, bang2 ] = getTextElementPositions( paragraph, tokens );

			expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
			expect( comma.sourceCodeRange ).toEqual( { startOffset: 8, endOffset: 9 } );
			expect( space.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 10 } );
			expect( world.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 21 } );
			expect( bang.sourceCodeRange ).toEqual( { startOffset: 21, endOffset: 22 } );
			expect( space2.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 30 } );
			expect( hello2.sourceCodeRange ).toEqual( { startOffset: 30, endOffset: 35 } );
			expect( comma2.sourceCodeRange ).toEqual( { startOffset: 35, endOffset: 36 } );
			expect( space3.sourceCodeRange ).toEqual( { startOffset: 36, endOffset: 37 } );
			expect( yoast.sourceCodeRange ).toEqual( { startOffset: 41, endOffset: 46 } );
			expect( bang2.sourceCodeRange ).toEqual( { startOffset: 51, endOffset: 52 } );

			const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
			const [ helloSentence, yoastSentence ] = getTextElementPositions( paragraph, sentences );
			expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 22 } );
			expect( yoastSentence.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 52 } );
		} );

	it( "doesn't include an opening tag at the end of a sentence when calculating the end position", function() {
		// HTML: <p>Hello, world!<span> Hello, <em>yoast!</em></span></p>.
		const html = "<p>Hello, world!<span> Hello, <em>yoast!</em></span></p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!", " ", "Hello", ",", " ", "yoast", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang, space2, hello2, comma2, space3, yoast, bang2 ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 8, endOffset: 9 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 10 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 10, endOffset: 15 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 16 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 22, endOffset: 23 } );
		expect( hello2.sourceCodeRange ).toEqual( { startOffset: 23, endOffset: 28 } );
		expect( comma2.sourceCodeRange ).toEqual( { startOffset: 28, endOffset: 29 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 29, endOffset: 30 } );
		expect( yoast.sourceCodeRange ).toEqual( { startOffset: 34, endOffset: 39 } );
		expect( bang2.sourceCodeRange ).toEqual( { startOffset: 39, endOffset: 40 } );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const [ helloSentence, yoastSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 16 } );
		expect( yoastSentence.sourceCodeRange ).toEqual( { startOffset: 22, endOffset: 40 } );
	} );

	it( "gets the sentence positions from an implicit paragraph", function() {
		// HTML: <div>Hello <em>World!</em></div>.

		const html = "<div>Hello <em>World!</em></div>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", " ", "World", "!" ].map( string => new Token( string ) );

		const [ hello, space, world, bang ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 5, endOffset: 10 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 10, endOffset: 11 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 20 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 20, endOffset: 21 } );

		const sentences = [ { text: "Hello World!" } ];
		const [ helloSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 5, endOffset: 21 } );
	} );

	it( "should get the correct sentence position for a sentence in an image caption", function() {
		// html: "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
		// 			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
		// 			"A flamboyant cat with a toy<br></br>\n" +
		// 			"</p>"

		const html = "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img>A flamboyant cat with a toy<br></br>\n</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "A", " ", "flamboyant", " ", "cat", " ", "with", " ", "a", " ", "toy" ].map( string => new Token( string ) );

		const [ a, space, flamboyant, space2, cat, space3, withWord, space4, a2, space5, toy ] = getTextElementPositions( paragraph, tokens );

		expect( a.sourceCodeRange ).toEqual( { startOffset: 193, endOffset: 194 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 194, endOffset: 195 } );
		expect( flamboyant.sourceCodeRange ).toEqual( { startOffset: 195, endOffset: 205 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 205, endOffset: 206 } );
		expect( cat.sourceCodeRange ).toEqual( { startOffset: 206, endOffset: 209 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 209, endOffset: 210 } );
		expect( withWord.sourceCodeRange ).toEqual( { startOffset: 210, endOffset: 214 } );
		expect( space4.sourceCodeRange ).toEqual( { startOffset: 214, endOffset: 215 } );
		expect( a2.sourceCodeRange ).toEqual( { startOffset: 215, endOffset: 216 } );
		expect( space5.sourceCodeRange ).toEqual( { startOffset: 216, endOffset: 217 } );
		expect( toy.sourceCodeRange ).toEqual( { startOffset: 217, endOffset: 220 } );

		const sentences = [ { text: "A flamboyant cat with a toy" } ];
		const [ aSentence ] = getTextElementPositions( paragraph, sentences );
		expect( aSentence.sourceCodeRange ).toEqual( { startOffset: 193, endOffset: 220 } );
	} );

	it( "gets the sentence positions from a heading", function() {
		// HTML: <h2>Hello, world! Hello, yoast!</h2>.
		const node = new Heading( 2, {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" } ],
			{
				startOffset: 5,
				endOffset: 40,
				startTag: {
					startOffset: 5,
					endOffset: 9,
				},
				endTag: {
					startOffset: 36,
					endOffset: 40,
				},
			} );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const sentencesWithPositions = [ { text: "Hello, world!", sourceCodeRange: { startOffset: 9, endOffset: 22 } },
			{ text: " Hello, yoast!", sourceCodeRange: { startOffset: 22, endOffset: 36 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "gets the sentence positions for sentences written in an RTL script (Hebrew)", function() {
		// HTML: <p>שלום עולם. זה החתול שלי.</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "שלום עולם. זה החתול שלי." } ],
			{
				startOffset: 5,
				endOffset: 31,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 27,
					endOffset: 31,
				},
			} );

		const sentences = [ { text: "שלום עולם." }, { text: "זה החתול שלי." } ];
		const sentencesWithPositions = [ { text: "שלום עולם.", sourceCodeRange: { startOffset: 8, endOffset: 18 } },
			{ text: "זה החתול שלי.", sourceCodeRange: { startOffset: 18, endOffset: 31 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "gets the sentence positions for sentences written in an RTL script (Arabic)", function() {
		// HTML: <p>.مرحبا بالعالم. هذه قطتي</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "مرحبا بالعالم. هذه قطتي." } ],
			{
				startOffset: 5,
				endOffset: 32,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 28,
					endOffset: 32,
				},
			} );

		const sentences = [ { text: "هذه قطتي." }, { text: "مرحبا بالعالم. " } ];
		const sentencesWithPositions = [ { text: "هذه قطتي.", sourceCodeRange: { startOffset: 8, endOffset: 17 } },
			{ text: "مرحبا بالعالم. ", sourceCodeRange: { startOffset: 17, endOffset: 32 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "gets the sentence positions for sentences written in an RTL script with `span` tags.", function() {
		// HTML: <p>.שלום<span> עולם</span> .זה החתול שלי</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "שלום עולם. זה החתול שלי." },
			{
				name: "span",
				attributes: {},
				childNodes: [ {
					name: "#text",
					value: "עולם ",
				} ],
				sourceCodeLocation: {
					startOffset: 12,
					endOffset: 30,
					startTag: {
						startOffset: 12,
						endOffset: 18,
					},
					endTag: {
						startOffset: 23,
						endOffset: 30,
					},
				},
			} ],
		{
			startOffset: 5,
			endOffset: 48,
			startTag: {
				startOffset: 5,
				endOffset: 8,
			},
			endTag: {
				startOffset: 44,
				endOffset: 48,
			},
		} );

		const sentences = [ { text: "שלום עולם." }, { text: "זה החתול שלי." } ];
		const sentencesWithPositions = [ { text: "שלום עולם.", sourceCodeRange: { startOffset: 8, endOffset: 31 } },
			{ text: "זה החתול שלי.", sourceCodeRange: { startOffset: 31, endOffset: 44 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "gets the token positions from a node that doesn't have descendants other than the Text node", function() {
		// HTML: <p>Hello, world!</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world!" } ],
			{
				startOffset: 0,
				endOffset: 21,
				startTag: {
					startOffset: 0,
					endOffset: 3,
				},
				endTag: {
					startOffset: 17,
					endOffset: 21,
				},
			} );

		const tokens = [ { text: "Hello" }, { text: "," }, { text: " " }, { text: "world" }, { text: "!" } ];
		const tokensWithPositions = [
			{ text: "Hello", sourceCodeRange: { startOffset: 3, endOffset: 8 } },
			{ text: ",", sourceCodeRange: { startOffset: 8, endOffset: 9 } },
			{ text: " ", sourceCodeRange: { startOffset: 9, endOffset: 10 } },
			{ text: "world", sourceCodeRange: { startOffset: 10, endOffset: 15 } },
			{ text: "!", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
		];

		expect( getTextElementPositions( node, tokens ) ).toEqual( tokensWithPositions );
	} );

	it( "gets the token positions from a node that has multiple descendants", function() {
		// HTML: <p><strong>Hello</strong>, <em>world</em>!</p>.
		const html = "<p><strong>Hello</strong>, <em>world</em>!</p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "World", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 11, endOffset: 16 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 25, endOffset: 26 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 26, endOffset: 27 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 31, endOffset: 36 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 41, endOffset: 42 } );

		const sentences = [ { text: "Hello, World!" } ];
		const [ helloSentence ] = getTextElementPositions( paragraph, sentences );
		expect( helloSentence.sourceCodeRange ).toEqual( { startOffset: 11, endOffset: 42 } );

		//
		// const node = new Paragraph( {}, [
		// 	{ name: "#text", value: "Hello, world!" },
		// 	{
		// 		name: "strong",
		// 		attributes: {},
		// 		childNodes: [
		// 			{
		// 				name: "#text",
		// 				value: "Hello",
		// 			},
		// 		],
		// 		sourceCodeLocation: {
		// 			startTag: {
		// 				startOffset: 3,
		// 				endOffset: 11,
		// 			},
		// 			endTag: {
		// 				startOffset: 16,
		// 				endOffset: 25,
		// 			},
		// 			startOffset: 3,
		// 			endOffset: 25,
		// 		},
		// 	},
		// 	{
		// 		name: "em",
		// 		attributes: {},
		// 		childNodes: [
		// 			{
		// 				name: "#text",
		// 				value: "world",
		// 			},
		// 		],
		// 		sourceCodeLocation: {
		// 			startTag: {
		// 				startOffset: 27,
		// 				endOffset: 31,
		// 			},
		// 			endTag: {
		// 				startOffset: 36,
		// 				endOffset: 41,
		// 			},
		// 			startOffset: 27,
		// 			endOffset: 41,
		// 		},
		// 	},
		// ],
		// {
		// 	startTag: {
		// 		startOffset: 0,
		// 		endOffset: 3,
		// 	},
		// 	endTag: {
		// 		startOffset: 42,
		// 		endOffset: 46,
		// 	},
		// 	startOffset: 0,
		// 	endOffset: 46,
		// } );
		//
		// const tokens = [ { text: "Hello" }, { text: "," }, { text: " " }, { text: "world" }, { text: "!" } ];
		// const tokensWithPositions = [
		// 	{ text: "Hello", sourceCodeRange: { startOffset: 3, endOffset: 25 } },
		// 	{ text: ",", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
		// 	{ text: " ", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
		// 	{ text: "world", sourceCodeRange: { startOffset: 27, endOffset: 41 } },
		// 	{ text: "!", sourceCodeRange: { startOffset: 41, endOffset: 42 } },
		// ];
		//
		// expect( getTextElementPositions( node, tokens ) ).toEqual( tokensWithPositions );
	} );

	it( "don't calculate sentence position if the source code location of the node is unknown", function() {
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" } ] );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentences );
	} );

	it( "calculates the position of tokens correctly", () => {
		const html = "<p><span>Hello, world!</span></p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", ",", " ", "world", "!" ].map( string => new Token( string ) );

		const [ hello, comma, space, world, bang ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 9, endOffset: 14 } );
		expect( comma.sourceCodeRange ).toEqual( { startOffset: 14, endOffset: 15 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 16 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 21 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 21, endOffset: 22 } );
	} );
} );
