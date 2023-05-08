import adapt from "../../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";
import { filterBeforeTokenizing } from "../../../../src/parse/build/private/filterBeforeTokenizing";

describe( "A test for filterBeforeTokenizing", () => {
	it( "should filter the text child node and the startTag and endTag properties of a code node", () => {
		const html = "<p>Some text and code <code>console.log( code )</code></p>";

		let tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		tree = filterBeforeTokenizing( tree );

		const expectedTree = {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "p",
					isImplicit: false,
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "Some text and code ",
						},
						{
							name: "code",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: {
								endOffset: 54,
								startOffset: 22,
							},
						},
					],
					sourceCodeLocation: {
						endOffset: 58,
						endTag: {
							endOffset: 58,
							startOffset: 54,
						},
						startOffset: 0,
						startTag: {
							endOffset: 3,
							startOffset: 0,
						},
					},
				},
			],
		};

		expect( tree ).toEqual( expectedTree );
	} );
	it( "should filter the text child node and the startTag and endTag properties of a script node", () => {
		const html = "<div><script>console.log(\"Hello, world!\")</script><p>Hello, world!</p></div>";

		let tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		tree = filterBeforeTokenizing( tree );

		const expectedTree = {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							childNodes: [
								{
									name: "script",
									attributes: {},
									childNodes: [],
									sourceCodeLocation: {
										startOffset: 5,
										endOffset: 50,
									},
								},
							],
							sourceCodeLocation: {
								startOffset: 5,
								endOffset: 50,
							},
						},
						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "Hello, world!",
								},
							],
							sourceCodeLocation: {
								startOffset: 50,
								endOffset: 70,
								startTag: {
									startOffset: 50,
									endOffset: 53,
								},
								endTag: {
									startOffset: 66,
									endOffset: 70,
								},
							},
						},
					],
					name: "div",
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 76,
						startTag: {
							startOffset: 0,
							endOffset: 5,
						},
						endTag: {
							startOffset: 70,
							endOffset: 76,
						},
					},
				},
			],
		};

		expect( tree ).toEqual( expectedTree );
	} );
	it( "should filter the text child node and the startTag and endTag properties of also from code's child node", () => {
		const html = "<p>Some text and code <code><strong>console.log</strong>( code )</code></p>";

		let tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		tree = filterBeforeTokenizing( tree );

		const expectedTree = {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "p",
					isImplicit: false,
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "Some text and code ",
						},
						{
							name: "code",
							attributes: {},
							childNodes: [
								{
									name: "strong",
									attributes: {},
									childNodes: [],
									sourceCodeLocation: {
										endOffset: 56,
										startOffset: 28,
									},
								},
							],
							sourceCodeLocation: {
								endOffset: 71,
								startOffset: 22,
							},
						},
					],
					sourceCodeLocation: {
						endOffset: 75,
						endTag: {
							endOffset: 75,
							startOffset: 71,
						},
						startOffset: 0,
						startTag: {
							endOffset: 3,
							startOffset: 0,
						},
					},
				},
			],
		};

		expect( tree ).toEqual( expectedTree );
	} );
} );
