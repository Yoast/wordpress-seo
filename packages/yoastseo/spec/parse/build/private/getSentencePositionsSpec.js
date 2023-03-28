import getSentencePositions from "../../../../src/parse/build/private/getSentencePositions";
import Paragraph from "../../../../src/parse/structure/Paragraph";

describe( "A test for getting positions of sentences", () => {
	it( "gets the sentence positions from a node that doesn't have descendant nodes other than the Text node", function() {
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
} );
