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

	it.skip( "gets the token and sentence positions from a node that has a descendant node without a closing tag (img)", function() {
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

	it( "gets the sentence positions from a node that has a descendant node without opening or closing tags (comment)", function() {
		// HTML: <p>Hello, <!-- A comment --> world!</p>
		const node = new Paragraph( {}, [
			{
				name: "#text",
				value: "Hello, ",
			},
			{
				name: "#comment",
				attributes: {},
				childNodes: [],
				sourceCodeLocation: { startOffset: 15, endOffset: 33 },
			},
			{
				name: "#text",
				value: " world!",
			} ],
		{
			startOffset: 5,
			endOffset: 44,
			startTag: {
				startOffset: 5,
				endOffset: 8,
			},
			endTag: {
				startOffset: 40,
				endOffset: 44,
			},
		} );

		const sentences = [ { text: "Hello,  world!" } ];
		const sentencesWithPositions = [ { text: "Hello,  world!", sourceCodeRange: { startOffset: 8, endOffset: 40 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );

	it( "should determine the correct token positions when the sentence contains a br tag", function() {
		// HTML: <p>Hello<br />world!</p>.
		const html = "<p>Hello<br />world!</p>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];
		const tokens = [ "Hello", "\n", "world", "!" ].map( string => new Token( string ) );

		const [ hello, br, world, bang ] = getTextElementPositions( paragraph, tokens, 3 );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 8 } );
		expect( br.sourceCodeRange ).toEqual( { startOffset: 13, endOffset: 14 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 14, endOffset: 19 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 19, endOffset: 20 } );
	} );

	it( "gets the sentence positions from a node that has a code child node", function() {
		// HTML: <p>Hello <code>array.push( something )</code> code!</p>
		const node = new Paragraph( {}, [
			{
				name: "#text",
				value: "Hello ",
			},
			{
				name: "code",
				attributes: {},
				childNodes: [],
				sourceCodeLocation: {
					startOffset: 14,
					endOffset: 50,
				},
			},
			{
				name: "#text",
				value: " code!",
			} ],
		{
			startOffset: 5,
			endOffset: 60,
			startTag: {
				startOffset: 5,
				endOffset: 8,
			},
			endTag: {
				startOffset: 56,
				endOffset: 60,
			},
		} );

		const sentences = [ { text: "Hello  code!" } ];
		const sentencesWithPositions = [ { text: "Hello  code!", sourceCodeRange: { startOffset: 8, endOffset: 56 } } ];

		expect( getTextElementPositions( node, sentences ) ).toEqual( sentencesWithPositions );
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

	it.skip( "should get the correct sentence position for a sentence in an image caption", function() {
		// html: 	"<p>
		// 				<img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'>
		// 				</img>
		// 				A flamboyant cat with a toy<br></br>\n
		// 			</p>

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

	it( "should correctly add positions to an implicit paragraph", function() {
		const html = "Hello world!";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];

		const tokens = [ "Hello", " ", "world", "!" ].map( string => new Token( string ) );

		const [ hello, space, world, bang ] = getTextElementPositions( paragraph, tokens );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 0, endOffset: 5 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 5, endOffset: 6 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 6, endOffset: 11 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 11, endOffset: 12 } );
	} );

	it( "should correctly add positions to two sentences in an implicit paragraph", function() {
		const html = "Hello world! It is <strong>Yoast</strong>.";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const paragraph = tree.childNodes[ 0 ];

		expect( paragraph.sourceCodeLocation ).toEqual( { startOffset: 0, endOffset: 42 } );

		const tokens = [ "Hello", " ", "world", "!" ].map( string => new Token( string ) );
		const tokens2 = [ "It", " ", "is", " ", "Yoast", "." ].map( string => new Token( string ) );

		const [ hello, space, world, bang ] = getTextElementPositions( paragraph, tokens );
		const [ it, space2, is, space3, yoast, dot ] = getTextElementPositions( paragraph, tokens2, 13 );

		expect( hello.sourceCodeRange ).toEqual( { startOffset: 0, endOffset: 5 } );
		expect( space.sourceCodeRange ).toEqual( { startOffset: 5, endOffset: 6 } );
		expect( world.sourceCodeRange ).toEqual( { startOffset: 6, endOffset: 11 } );
		expect( bang.sourceCodeRange ).toEqual( { startOffset: 11, endOffset: 12 } );

		expect( it.sourceCodeRange ).toEqual( { startOffset: 13, endOffset: 15 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 15, endOffset: 16 } );
		expect( is.sourceCodeRange ).toEqual( { startOffset: 16, endOffset: 18 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 18, endOffset: 19 } );
		expect( yoast.sourceCodeRange ).toEqual( { startOffset: 27, endOffset: 32 } );
		expect( dot.sourceCodeRange ).toEqual( { startOffset: 41, endOffset: 42 } );
	} );

	it( "correctly calculates the position of an image caption", () => {
		const html = "<div>[caption id=\"attachment_3341501\" align=\"alignnone\" width=\"300\"]" +
			"<img class=\"cls\" src=\"yoast.com/image.jpg\" alt=\"alt\" width=\"300\" height=\"300\" />" +
			" An image with the keyword in the caption.[/caption]</div>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const div = tree.childNodes[ 0 ];
		const caption = div.childNodes[ 0 ];

		const tokens = [ " ", "An", " ", "image", " ", "with", " ", "the", " ", "keyword", " ", "in", " ", "the", " ", "caption", "." ].map(
			string => new Token( string ) );

		const [ space0, an, space1, image, space2, withToken, space3, the,
			space4, keyword, space5, inToken, space6, the2, space7, captionToken, dot ] = getTextElementPositions( caption, tokens, 148 );

		expect( space0.sourceCodeRange ).toEqual( { startOffset: 148, endOffset: 149 } );
		expect( an.sourceCodeRange ).toEqual( { startOffset: 149, endOffset: 151 } );
		expect( space1.sourceCodeRange ).toEqual( { startOffset: 151, endOffset: 152 } );
		expect( image.sourceCodeRange ).toEqual( { startOffset: 152, endOffset: 157 } );
		expect( space2.sourceCodeRange ).toEqual( { startOffset: 157, endOffset: 158 } );
		expect( withToken.sourceCodeRange ).toEqual( { startOffset: 158, endOffset: 162 } );
		expect( space3.sourceCodeRange ).toEqual( { startOffset: 162, endOffset: 163 } );
		expect( the.sourceCodeRange ).toEqual( { startOffset: 163, endOffset: 166 } );
		expect( space4.sourceCodeRange ).toEqual( { startOffset: 166, endOffset: 167 } );
		expect( keyword.sourceCodeRange ).toEqual( { startOffset: 167, endOffset: 174 } );
		expect( space5.sourceCodeRange ).toEqual( { startOffset: 174, endOffset: 175 } );
		expect( inToken.sourceCodeRange ).toEqual( { startOffset: 175, endOffset: 177 } );
		expect( space6.sourceCodeRange ).toEqual( { startOffset: 177, endOffset: 178 } );
		expect( the2.sourceCodeRange ).toEqual( { startOffset: 178, endOffset: 181 } );
		expect( space7.sourceCodeRange ).toEqual( { startOffset: 181, endOffset: 182 } );
		expect( captionToken.sourceCodeRange ).toEqual( { startOffset: 182, endOffset: 189 } );
		expect( dot.sourceCodeRange ).toEqual( { startOffset: 189, endOffset: 190 } );
	} );
} );
