import adapt from "../../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";
import Node from "../../../../src/parse/structure/Node";
import Text from "../../../../src/parse/structure/Text";
import Heading from "../../../../src/parse/structure/Heading";

describe( "The adapt function",
	() => {
		it( "adapts a basic div element", () => {
			const html = "<div><p class='yoast'>Hello, world!</p></div>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "p",
						isImplicit: false,
						sourceCodeLocation: {
							startOffset: 5,
							endOffset: 39,
							startTag: {
								startOffset: 5,
								endOffset: 22,
							},
							endTag: {
								startOffset: 35,
								endOffset: 39,
							},
						},
						attributes: {
							"class": new Set( [ "yoast" ] ),
						},
						childNodes: [ {
							name: "#text",
							value: "Hello, world!",
							sourceCodeRange: {
								startOffset: 22,
								endOffset: 35,
							},
						} ],
					} ],
					name: "div",
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 45,
						startTag: {
							startOffset: 0,
							endOffset: 5,
						},
						endTag: {
							startOffset: 39,
							endOffset: 45,
						},
					},
				} ],
				name: "#document-fragment",
			};

			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a heading element", () => {
			const html = "<h1>Hello World!</h1>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );
			const adaptedTree = adapt( tree );

			const expected = new Node( "#document-fragment", {}, [
				new Heading( 1, {}, [
					new Text(  { value: "Hello World!", sourceCodeLocation: { startOffset: 4, endOffset: 16 } } ),
				], { startOffset: 0, endOffset: 21, startTag: { startOffset: 0, endOffset: 4 }, endTag: { startOffset: 16, endOffset: 21 } } ),
			] );
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a code element inside a paragraph", () => {
			const html = "<p>Hello World! <code>function()</code> Hello Yoast!</p>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "p",
						isImplicit: false,
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 56,
							startTag: {
								startOffset: 0,
								endOffset: 3,
							},
							endTag: {
								startOffset: 52,
								endOffset: 56,
							},
						},
						childNodes: [
							{
								name: "#text",
								value: "Hello World! ",
								sourceCodeRange: {
									startOffset: 3,
									endOffset: 16,
								},
							},
							{
								name: "code",
								attributes: {},
								sourceCodeLocation: {
									startOffset: 16,
									endOffset: 39,
									startTag: {
										startOffset: 16,
										endOffset: 22,
									},
									endTag: {
										startOffset: 32,
										endOffset: 39,
									},
								},
								childNodes: [
									{
										name: "#text",
										value: "function()",
										sourceCodeRange: {
											startOffset: 22,
											endOffset: 32,
										},
									},
								],
							},
							{
								name: "#text",
								value: " Hello Yoast!",
								sourceCodeRange: {
									startOffset: 39,
									endOffset: 52,
								},
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a code element within a sentence", () => {
			const html = "<p>Hello <code>push()</code> World!</p>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "p",
						isImplicit: false,
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 39,
							startTag: {
								startOffset: 0,
								endOffset: 3,
							},
							endTag: {
								startOffset: 35,
								endOffset: 39,
							},
						},
						childNodes: [
							{
								name: "#text",
								value: "Hello ",
								sourceCodeRange: {
									startOffset: 3,
									endOffset: 9,
								},
							},
							{
								name: "code",
								attributes: {},
								sourceCodeLocation: {
									startOffset: 9,
									endOffset: 28,
									startTag: {
										startOffset: 9,
										endOffset: 15,
									},
									endTag: {
										startOffset: 21,
										endOffset: 28,
									},
								},
								childNodes: [
									{
										name: "#text",
										value: "push()",
										sourceCodeRange: {
											startOffset: 15,
											endOffset: 21,
										},
									},
								],
							},
							{
								name: "#text",
								value: " World!",
								sourceCodeRange: {
									startOffset: 28,
									endOffset: 35,
								},
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a script element", () => {
			const html = "<div><script>alert(\"Hello World!\");</script><p>Hello World!</p></div>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "div",
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 69,
							startTag: {
								startOffset: 0,
								endOffset: 5,
							},
							endTag: {
								startOffset: 63,
								endOffset: 69,
							},
						},
						childNodes: [
							{
								name: "p",
								isImplicit: true,
								attributes: {},
								sourceCodeLocation: {
									startOffset: 5,
									endOffset: 44,
								},
								childNodes: [
									{
										name: "script",
										attributes: {},
										sourceCodeLocation: {
											startOffset: 5,
											endOffset: 44,
											startTag: {
												startOffset: 5,
												endOffset: 13,
											},
											endTag: {
												startOffset: 35,
												endOffset: 44,
											},
										},
										childNodes: [
											{
												name: "#text",
												value: "alert(\"Hello World!\");",
												sourceCodeRange: {
													startOffset: 13,
													endOffset: 35,
												},
											},
										],
									},
								],
							},
							{
								name: "p",
								isImplicit: false,
								attributes: {},
								sourceCodeLocation: {
									startOffset: 44,
									endOffset: 63,
									startTag: {
										startOffset: 44,
										endOffset: 47,
									},
									endTag: {
										startOffset: 59,
										endOffset: 63,
									},
								},
								childNodes: [
									{
										name: "#text",
										value: "Hello World!",
										sourceCodeRange: {
											startOffset: 47,
											endOffset: 59,
										},
									},
								],
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a script element within a paragraph", () => {
			const html = "<div><p><script>alert(\"Hello World!\");</script> Hello World!</p></div>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "div",
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 70,
							startTag: {
								startOffset: 0,
								endOffset: 5,
							},
							endTag: {
								startOffset: 64,
								endOffset: 70,
							},
						},
						childNodes: [
							{
								name: "p",
								isImplicit: false,
								attributes: {},
								sourceCodeLocation: {
									startOffset: 5,
									endOffset: 64,
									startTag: {
										startOffset: 5,
										endOffset: 8,
									},
									endTag: {
										startOffset: 60,
										endOffset: 64,
									},
								},
								childNodes: [
									{
										name: "script",
										attributes: {},
										sourceCodeLocation: {
											startOffset: 8,
											endOffset: 47,
											startTag: {
												startOffset: 8,
												endOffset: 16,
											},
											endTag: {
												startOffset: 38,
												endOffset: 47,
											},
										},
										childNodes: [
											{
												name: "#text",
												value: "alert(\"Hello World!\");",
												sourceCodeRange: {
													startOffset: 16,
													endOffset: 38,
												},
											},
										],
									},
									{
										name: "#text",
										value: " Hello World!",
										sourceCodeRange: {
											startOffset: 47,
											endOffset: 60,
										},
									},
								],
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a style element", () => {
			const html = "<style>div { color: #FF00FF}</style><p>Hello World!</p>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "style",
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 36,
							startTag: {
								startOffset: 0,
								endOffset: 7,
							},
							endTag: {
								startOffset: 28,
								endOffset: 36,
							},
						},
						childNodes: [
							{
								name: "p",
								isImplicit: true,
								attributes: {},
								sourceCodeLocation: {
									startOffset: 7,
									endOffset: 28,
								},
								childNodes: [
									{
										name: "#text",
										value: "div { color: #FF00FF}",
										sourceCodeRange: {
											startOffset: 7,
											endOffset: 28,
										},
									},
								],
							},
						],
					},
					{
						name: "p",
						isImplicit: false,
						attributes: {},
						sourceCodeLocation: {
							startOffset: 36,
							endOffset: 55,
							startTag: {
								startOffset: 36,
								endOffset: 39,
							},
							endTag: {
								startOffset: 51,
								endOffset: 55,
							},
						},
						childNodes: [
							{
								name: "#text",
								value: "Hello World!",
								sourceCodeRange: {
									startOffset: 39,
									endOffset: 51,
								},
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );


		it( "adapts a tree with a blockquote element", () => {
			const html = "<div><p>Hello World!</p><blockquote>Hello Yoast!</blockquote></div>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const expected = {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "div",
						attributes: {},
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 67,
							startTag: {
								startOffset: 0,
								endOffset: 5,
							},
							endTag: {
								startOffset: 61,
								endOffset: 67,
							},
						},
						childNodes: [
							{
								name: "p",
								isImplicit: false,
								attributes: {},
								sourceCodeLocation: {
									startOffset: 5,
									endOffset: 24,
									startTag: {
										startOffset: 5,
										endOffset: 8,
									},
									endTag: {
										startOffset: 20,
										endOffset: 24,
									},
								},
								childNodes: [
									{
										name: "#text",
										value: "Hello World!",
										sourceCodeRange: {
											startOffset: 8,
											endOffset: 20,
										},
									},
								],
							},
							{
								name: "blockquote",
								attributes: {},
								sourceCodeLocation: {
									startOffset: 24,
									endOffset: 61,
									startTag: {
										startOffset: 24,
										endOffset: 36,
									},
									endTag: {
										startOffset: 48,
										endOffset: 61,
									},
								},
								childNodes: [
									{
										name: "p",
										isImplicit: true,
										attributes: {},
										sourceCodeLocation: {
											startOffset: 36,
											endOffset: 48,
										},
										childNodes: [
											{
												name: "#text",
												value: "Hello Yoast!",
												sourceCodeRange: {
													startOffset: 36,
													endOffset: 48,
												},
											},
										],
									},
								],
							},
						],
					},
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "should correctly adapt a fragment with a (overarching) paragraph element that has double line breaks as child nodes", () => {
			const html = "<p>test<br data-mce-fragment='1'><br data-mce-fragment='1'>test<br />test</p>";
			const tree = parseFragment( html, { sourceCodeLocationInfo: true } );

			const adaptedTree = adapt( tree );

			const overarchingParagraph = adaptedTree.childNodes[ 0 ];
			expect( overarchingParagraph.name ).toEqual( "p-overarching" );
			expect( overarchingParagraph.childNodes[ 0 ].name ).toEqual( "p" );
			expect( overarchingParagraph.childNodes[ 0 ].isImplicit ).toBeTruthy();
			expect( overarchingParagraph.childNodes[ 1 ].name ).toEqual( "br" );
			expect( overarchingParagraph.childNodes[ 2 ].name ).toEqual( "br" );
			expect( overarchingParagraph.childNodes[ 3 ].name ).toEqual( "p" );
			expect( overarchingParagraph.childNodes[ 3 ].isImplicit ).toBeTruthy();
		} );

		it( "should correctly adapt a node with no childNodes.", () => {
			const tree = { nodeName: "div" };
			const adaptedTree = adapt( tree );

			const expected = { attributes: {}, childNodes: [], name: "div" };
			expect( adaptedTree ).toEqual( expected );
		} );
	}
);
