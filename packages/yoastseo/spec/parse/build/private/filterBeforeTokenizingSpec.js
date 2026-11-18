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
							sourceCodeRange: {
								startOffset: 3,
								endOffset: 22,
							},
						},
						{
							name: "code",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: {
								startOffset: 22,
								endOffset: 54,
								startTag: {
									startOffset: 22,
									endOffset: 28,
								},
								endTag: {
									startOffset: 47,
									endOffset: 54,
								},
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 58,
						startTag: {
							endOffset: 3,
							startOffset: 0,
						},
						endTag: {
							startOffset: 54,
							endOffset: 58,
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
										startTag: {
											startOffset: 5,
											endOffset: 13,
										},
										endTag: {
											startOffset: 41,
											endOffset: 50,
										},
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
									sourceCodeRange: {
										startOffset: 53,
										endOffset: 66,
									},
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
	it( "should remove other child nodes of a code node, in addition to removing the text child node", () => {
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
							sourceCodeRange: {
								startOffset: 3,
								endOffset: 22,
							},
						},
						{
							name: "code",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: {
								startOffset: 22,
								endOffset: 71,
								startTag: {
									startOffset: 22,
									endOffset: 28,
								},
								endTag: {
									startOffset: 64,
									endOffset: 71,
								},
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 75,
						startTag: {
							startOffset: 0,
							endOffset: 3,
						},
						endTag: {
							startOffset: 71,
							endOffset: 75,
						},
					},
				},
			],
		};

		expect( tree ).toEqual( expectedTree );
	} );
	it( "should remove grandchildren of a code node", () => {
		const html = "<p>Some text and code <code><strong><span>console</span>.log</strong>( code )</code></p>";

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
							sourceCodeRange: {
								startOffset: 3,
								endOffset: 22,
							},
						},
						{
							name: "code",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: {
								startOffset: 22,
								endOffset: 84,
								startTag: {
									startOffset: 22,
									endOffset: 28,
								},
								endTag: {
									startOffset: 77,
									endOffset: 84,
								},
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 88,
						startTag: {
							startOffset: 0,
							endOffset: 3,
						},
						endTag: {
							startOffset: 84,
							endOffset: 88,
						},
					},
				},
			],
		};

		expect( tree ).toEqual( expectedTree );
	} );
} );
