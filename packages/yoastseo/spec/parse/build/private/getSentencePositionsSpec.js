import getSentencePositions from "../../../../src/parse/build/private/getSentencePositions";
import Paragraph from "../../../../src/parse/structure/Paragraph";
import Heading from "../../../../src/parse/structure/Heading";

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

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );
	it( "gets the sentence positions from a node that has a `span` descendant node", function() {
		// HTML: <p>Hello, <span>world!</span> Hello, yoast!</p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" },
				{
					name: "span",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "world!",
					} ],
					sourceCodeLocation: {
						startOffset: 15,
						endOffset: 34,
						startTag: {
							startOffset: 15,
							endOffset: 21,
						},
						endTag: {
							startOffset: 27,
							endOffset: 34,
						},
					},
				}, ],
			{
				startOffset: 5,
				endOffset: 39,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 48,
					endOffset: 52,
				},
			} );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const sentencesWithPositions = [ { text: "Hello, world!", sourceCodeRange: { startOffset: 8, endOffset: 34 } },
			{ text: " Hello, yoast!", sourceCodeRange: { startOffset: 34, endOffset: 48 } } ];

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );
	it( "gets the sentence positions from a node that has a `span` and an `em` descendant node", function() {
		// HTML: <p>Hello, <span>world!</span> Hello, <em>yoast!</em></p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" },
				{
					name: "span",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "world!",
					} ],
					sourceCodeLocation: {
						startOffset: 15,
						endOffset: 34,
						startTag: {
							startOffset: 15,
							endOffset: 21,
						},
						endTag: {
							startOffset: 27,
							endOffset: 34,
						},
					},
				},
				{
					name: "em",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "world!",
					} ],
					sourceCodeLocation: {
						startOffset: 42,
						endOffset: 57,
						startTag: {
							startOffset: 42,
							endOffset: 46,
						},
						endTag: {
							startOffset: 52,
							endOffset: 57,
						},
					},
				},],
			{
				startOffset: 5,
				endOffset: 61,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 57,
					endOffset: 61,
				},
			} );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const sentencesWithPositions = [ { text: "Hello, world!", sourceCodeRange: { startOffset: 8, endOffset: 34 } },
			{ text: " Hello, yoast!", sourceCodeRange: { startOffset: 34, endOffset: 57 } } ];

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );
	it( "doesn't include an opening tag at the end of a sentence when calculating the end position", function() {
		// HTML: <p>Hello, world!<span> Hello, <em>yoast!</em></span></p>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" },
				{
					name: "span",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "world!",
					} ],
					sourceCodeLocation: {
						startOffset: 21,
						endOffset: 57,
						startTag: {
							startOffset: 21,
							endOffset: 27,
						},
						endTag: {
							startOffset: 50,
							endOffset: 57,
						},
					},
				},
				{
					name: "em",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "world!",
					} ],
					sourceCodeLocation: {
						startOffset: 35,
						endOffset: 50,
						startTag: {
							startOffset: 35,
							endOffset: 39,
						},
						endTag: {
							startOffset: 45,
							endOffset: 50,
						},
					},
				},],
			{
				startOffset: 5,
				endOffset: 39,
				startTag: {
					startOffset: 5,
					endOffset: 8,
				},
				endTag: {
					startOffset: 57,
					endOffset: 61,
				},
			} );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];
		const sentencesWithPositions = [ { text: "Hello, world!", sourceCodeRange: { startOffset: 8, endOffset: 21 } },
			{ text: " Hello, yoast!", sourceCodeRange: { startOffset: 21, endOffset: 57 } } ];

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );
	it( "gets the sentence positions from an implicit paragraph", function() {
		// HTML: <div>Hello <em>World!</em></div>.
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, World!" },
				{
					name: "em",
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "World!",
					} ],
					sourceCodeLocation: {
						startOffset: 11,
						endOffset: 26,
						startTag: {
							startOffset: 11,
							endOffset: 15,
						},
						endTag: {
							startOffset: 21,
							endOffset: 26,
						},
					},
				},],
			{
				startOffset: 5,
				endOffset: 32,
			},
			true );

		const sentences = [ { text: "Hello World!" } ];
		const sentencesWithPositions = [ { text: "Hello World!", sourceCodeRange: { startOffset: 5, endOffset: 26 } } ];

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
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

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
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

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
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

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
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
				},],
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

		expect( getSentencePositions( node, sentences ) ).toEqual( sentencesWithPositions );
	} );
	it( "don't calculate sentence position if the source code location of the node is unknown", function() {
		const node = new Paragraph( {}, [ { name: "#text", value: "Hello, world! Hello, yoast!" } ] );

		const sentences = [ { text: "Hello, world!" }, { text: " Hello, yoast!" } ];

		expect( getSentencePositions( node, sentences ) ).toEqual( sentences );
	} );
} );
