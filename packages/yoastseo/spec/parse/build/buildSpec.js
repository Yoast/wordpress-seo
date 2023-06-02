import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";

describe( "The parse function", () => {
	it( "parses a basic HTML text", () => {
		const html = "<div><p class='yoast'>Hello, world!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
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
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: false,
					attributes: {
						"class": new Set( [ "yoast" ] ),
					},
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
					childNodes: [ {
						name: "#text",
						value: "Hello, world!",
					} ],
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
				} ],
			} ],
		} );
	} );

	it( "adds implicit paragraphs around phrasing content outside of paragraphs and headings", () => {
		const html = "<div>Hello <span>World!</span></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		/*
		 * Should become
		 * ```
		 * [#document-fragment]
		 * 		<div>
		 * 			[p]
		 * 				Hello <span>World!</span>
		 * 			[/p]
		 * 		</div>
		 * [/#document-fragment]
		 * ```
		 */
		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: true,
					attributes: {},
					sentences: [ {
						text: "Hello World!",
						sourceCodeRange: { startOffset: 5, endOffset: 23 },
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 5, endOffset: 10 } },
							{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
							{ text: "World", sourceCodeRange: { startOffset: 17, endOffset: 22 } },
							{ text: "!", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
						],
					} ],
					childNodes: [
						{
							name: "#text",
							value: "Hello ",
						},
						{
							name: "span",
							attributes: {},
							childNodes: [ {
								name: "#text",
								value: "World!",
							} ],
							sourceCodeLocation: {
								startOffset: 11,
								endOffset: 30,
								startTag: {
									startOffset: 11,
									endOffset: 17,
								},
								endTag: {
									startOffset: 23,
									endOffset: 30,
								},
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 5,
						endOffset: 30,
					},
				} ],
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 36,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 30,
						endOffset: 36,
					},
				},
			} ],
		} );
	} );

	it( "parses another HTML text and adds implicit paragraphs where needed", () => {
		const html = "<div>Hello <p>World!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		/*
		 * Should become
		 * ```
		 * [#document-fragment]
		 * 		<div>
		 * 			[p]
		 * 				Hello
		 * 			[/p]
		 * 			<p>
		 * 				World!
		 * 			</p>
		 * 		</div>
		 * [/#document-fragment]
		 * ```
		 */
		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "div",
					attributes: {},
					childNodes: [
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							sentences: [ {
								text: "Hello ",
								sourceCodeRange: { startOffset: 5, endOffset: 11 },
								tokens: [
									{ text: "Hello", sourceCodeRange: { startOffset: 5, endOffset: 10 } },
									{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
								],
							} ],
							childNodes: [
								{
									name: "#text",
									value: "Hello ",
								},
							],
							sourceCodeLocation: {
								startOffset: 5,
								endOffset: 11,
							},
						},

						{
							name: "p",
							isImplicit: false,
							attributes: {},
							sentences: [ {
								text: "World!",
								sourceCodeRange: { startOffset: 14, endOffset: 20 },
								tokens: [
									{ text: "World", sourceCodeRange: { startOffset: 14, endOffset: 19 } },
									{ text: "!", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
								],
							} ],
							childNodes: [
								{
									name: "#text",
									value: "World!",
								},
							],
							sourceCodeLocation: {
								startOffset: 11,
								endOffset: 24,
								startTag: {
									startOffset: 11,
									endOffset: 14,
								},
								endTag: {
									startOffset: 20,
									endOffset: 24,
								},
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 30,
						startTag: {
							startOffset: 0,
							endOffset: 5,
						},
						endTag: {
							startOffset: 24,
							endOffset: 30,
						},
					},
				},
			],
		} );
	} );

	it( "parses an HTML text with implicit paragraphs before, between, and after p tags", () => {
		const html = "<div>So <em>long</em>, and <p>thanks</p> for <p>all</p> the <strong>fish</strong>!</div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		/*
		 * Should become
		 * ```
		 * [#document-fragment]
		 * 		<div>
		 * 			[p]
		 * 				So <em>long</em>, and
		 * 			[/p]
		 * 			<p>
		 * 				thanks
		 * 			</p>
		 * 			[p]
		 * 				for
		 * 			[/p]
		 * 			<p>
		 * 				all
		 * 			</p>
		 * 			[p]
		 * 				the <strong>fish</strong>
		 * 			[/p]
		 * 		</div>
		 * [/#document-fragment]
		 * ```
		 */
		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "div",
					attributes: {},
					childNodes: [
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "So ",
								},
								{
									name: "em",
									attributes: {},
									childNodes: [
										{
											name: "#text",
											value: "long",
										},
									],
									sourceCodeLocation: {
										startOffset: 8,
										endOffset: 21,
										startTag: {
											startOffset: 8,
											endOffset: 12,
										},
										endTag: {
											startOffset: 16,
											endOffset: 21,
										},
									},
								},
								{
									name: "#text",
									value: ", and ",
								},
							],
							sentences: [ {
								text: "So long, and ",
								sourceCodeRange: { startOffset: 5, endOffset: 27 },
								tokens: [
									{ text: "So", sourceCodeRange: { startOffset: 5, endOffset: 7 } },
									{ text: " ", sourceCodeRange: { startOffset: 7, endOffset: 8 } },
									{ text: "long", sourceCodeRange: { startOffset: 12, endOffset: 16 } },
									{ text: ",", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
									{ text: " ", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
									{ text: "and", sourceCodeRange: { startOffset: 23, endOffset: 26 } },
									{ text: " ", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
								],
							} ],
							sourceCodeLocation: {
								startOffset: 5,
								endOffset: 27,
							},
						},
						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "thanks",
								},
							],
							sentences: [ {
								text: "thanks",
								sourceCodeRange: { startOffset: 30, endOffset: 36 },
								tokens: [
									{ text: "thanks", sourceCodeRange: { startOffset: 30, endOffset: 36 } },
								],
							} ],
							sourceCodeLocation: {
								startOffset: 27,
								endOffset: 40,
								startTag: {
									startOffset: 27,
									endOffset: 30,
								},
								endTag: {
									startOffset: 36,
									endOffset: 40,
								},
							},
						},
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: " for ",
								},
							],
							sentences: [ {
								text: " for ",
								sourceCodeRange: { startOffset: 40, endOffset: 45 },
								tokens: [
									{ text: " ", sourceCodeRange: { startOffset: 40, endOffset: 41 } },
									{ text: "for", sourceCodeRange: { startOffset: 41, endOffset: 44 } },
									{ text: " ", sourceCodeRange: { startOffset: 44, endOffset: 45 } },
								],
							} ],
							sourceCodeLocation: {
								startOffset: 40,
								endOffset: 45,
							},
						},
						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "all",
								},
							],
							sentences: [ {
								text: "all",
								sourceCodeRange: { startOffset: 48, endOffset: 51 },
								tokens: [
									{ text: "all", sourceCodeRange: { startOffset: 48, endOffset: 51 } },
								],
							} ],
							sourceCodeLocation: {
								startOffset: 45,
								endOffset: 55,
								startTag: {
									startOffset: 45,
									endOffset: 48,
								},
								endTag: {
									startOffset: 51,
									endOffset: 55,
								},
							},
						},
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: " the ",
								},
								{
									name: "strong",
									attributes: {},
									childNodes: [
										{
											name: "#text",
											value: "fish",
										},
									],
									sourceCodeLocation: {
										startOffset: 60,
										endOffset: 81,
										startTag: {
											startOffset: 60,
											endOffset: 68,
										},
										endTag: {
											startOffset: 72,
											endOffset: 81,
										},
									},
								},
								{
									name: "#text",
									value: "!",
								},
							],
							sentences: [ {
								text: " the fish!",
								sourceCodeRange: { startOffset: 55, endOffset: 82 },
								tokens: [
									{ text: " ", sourceCodeRange: { startOffset: 55, endOffset: 56 } },
									{ text: "the", sourceCodeRange: { startOffset: 56, endOffset: 59 } },
									{ text: " ", sourceCodeRange: { startOffset: 59, endOffset: 60 } },
									{ text: "fish", sourceCodeRange: { startOffset: 68, endOffset: 72 } },
									{ text: "!", sourceCodeRange: { startOffset: 81, endOffset: 82 } },
								],
							} ],
							sourceCodeLocation: {
								startOffset: 55,
								endOffset: 82,
							},
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 88,
						startTag: {
							startOffset: 0,
							endOffset: 5,
						},
						endTag: {
							startOffset: 82,
							endOffset: 88,
						},
					},
				},
			],
		} );
	} );
	it( "parses an HTML text with a Yoast table of contents block, which should be filtered out", () => {
		// HTML: <div data-type="yoast-seo/table-of-contents">Hey, this is a table of contents.</div><p>And this is a paragraph.</p>
		const html = "<div data-type=\"yoast-seo/table-of-contents\">Hey, this is a table of contents.</div>" +
			"<p>And this is a paragraph.</p>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "And this is a paragraph.",
						},
					],
					isImplicit: false,
					name: "p",
					sentences: [
						{
							sourceCodeRange: {
								endOffset: 111,
								startOffset: 87,
							},
							text: "And this is a paragraph.",
							tokens: [
								{
									sourceCodeRange: {
										endOffset: 90,
										startOffset: 87,
									},
									text: "And",
								},
								{
									sourceCodeRange: {
										endOffset: 91,
										startOffset: 90,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										endOffset: 95,
										startOffset: 91,
									},
									text: "this",
								},
								{
									sourceCodeRange: {
										endOffset: 96,
										startOffset: 95,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										endOffset: 98,
										startOffset: 96,
									},
									text: "is",
								},
								{
									sourceCodeRange: {
										endOffset: 99,
										startOffset: 98,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										endOffset: 100,
										startOffset: 99,
									},
									text: "a",
								},
								{
									sourceCodeRange: {
										endOffset: 101,
										startOffset: 100,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										endOffset: 110,
										startOffset: 101,
									},
									text: "paragraph",
								},
								{
									sourceCodeRange: {
										endOffset: 111,
										startOffset: 110,
									},
									text: ".",
								},
							],
						},
					],
					sourceCodeLocation: {
						endOffset: 115,
						endTag: {
							endOffset: 115,
							startOffset: 111,
						},
						startOffset: 84,
						startTag: {
							endOffset: 87,
							startOffset: 84,
						},
					},
				},
			],
		} );
	} );
	it( "parses an HTML text with a Yoast breadcrumbs widget in Elementor, which should be filtered out", () => {
		// HTML: <p id="breadcrumbs"><span><span><a href="https://one.wordpress.test/">Home</a></span></span></p><p>The first sentence</p>
		const html = "<p id=\"breadcrumbs\"><span><span><a href=\"https://one.wordpress.test/\">Home</a></span></span></p><p>The first sentence</p>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual(
			{
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "The first sentence",
							},
						],
						isImplicit: false,
						name: "p",
						sentences: [
							{
								sourceCodeRange: {
									endOffset: 117,
									startOffset: 99,
								},
								text: "The first sentence",
								tokens: [
									{
										sourceCodeRange: {
											endOffset: 102,
											startOffset: 99,
										},
										text: "The",
									},
									{
										sourceCodeRange: {
											endOffset: 103,
											startOffset: 102,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 108,
											startOffset: 103,
										},
										text: "first",
									},
									{
										sourceCodeRange: {
											endOffset: 109,
											startOffset: 108,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 117,
											startOffset: 109,
										},
										text: "sentence",
									},
								],
							},
						],
						sourceCodeLocation: {
							endOffset: 121,
							endTag: {
								endOffset: 121,
								startOffset: 117,
							},
							startOffset: 96,
							startTag: {
								endOffset: 99,
								startOffset: 96,
							},
						},
					},
				],
			}
		);
	} );
	it( "parses an HTML text with a script element inside a paragraph", () => {
		const html = "<div><p><script>console.log(\"Hello, world!\")</script> Hello, world!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "div",
					attributes: {},
					sourceCodeLocation: {
						endOffset: 77,
						endTag: {
							endOffset: 77,
							startOffset: 71,
						},
						startOffset: 0,
						startTag: {
							endOffset: 5,
							startOffset: 0,
						},
					},
					childNodes: [
						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: " Hello, world!",
								},
							],
							sentences: [
								{
									text: " Hello, world!",
									sourceCodeRange: {
										startOffset: 53,
										endOffset: 67,
									},
									tokens: [
										{
											text: " ",
											sourceCodeRange: {
												startOffset: 53,
												endOffset: 54,
											},
										},
										{
											text: "Hello",
											sourceCodeRange: {
												startOffset: 54,
												endOffset: 59,
											},
										},
										{
											text: ",",
											sourceCodeRange: {
												startOffset: 59,
												endOffset: 60,
											},
										},
										{
											text: " ",
											sourceCodeRange: {
												startOffset: 60,
												endOffset: 61,
											},
										},
										{
											text: "world",
											sourceCodeRange: {
												startOffset: 61,
												endOffset: 66,
											},
										},
										{
											text: "!",
											sourceCodeRange: {
												startOffset: 66,
												endOffset: 67,
											},
										},
									],
								},
							],
							sourceCodeLocation: {
								startOffset: 5,
								endOffset: 71,
								startTag: {
									startOffset: 5,
									endOffset: 8,
								},
								endTag: {
									startOffset: 67,
									endOffset: 71,
								},
							},
						},
					],
				},
			],
		} );
	} );
	it( "parses an HTML text with a script element outside of a paragraph", () => {
		const html = "<script>console.log(\"Hello, world!\")</script><p>Hello, world!</p>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "p",
				isImplicit: true,
				attributes: {},
				sentences: [],
				childNodes: [],
			},
			{
				name: "p",
				isImplicit: false,
				attributes: {},
				sentences: [ {
					text: "Hello, world!",
					tokens: [
						{ text: "Hello", sourceCodeRange: { startOffset: 48, endOffset: 53 } },
						{ text: ",", sourceCodeRange: { startOffset: 53, endOffset: 54 } },
						{ text: " ", sourceCodeRange: { startOffset: 54, endOffset: 55 } },
						{ text: "world", sourceCodeRange: { startOffset: 55, endOffset: 60 } },
						{ text: "!", sourceCodeRange: { startOffset: 60, endOffset: 61 } },
					],
					sourceCodeRange: { startOffset: 48, endOffset: 61 },
				} ],
				childNodes: [ {
					name: "#text",
					value: "Hello, world!",
				} ],
				sourceCodeLocation: {
					startOffset: 45,
					endOffset: 65,
					startTag: {
						startOffset: 45,
						endOffset: 48,
					},
					endTag: {
						startOffset: 61,
						endOffset: 65,
					},
				},
			} ],
		} );
	} );
	it( "parses an HTML text with a comment inside a paragraph", () => {
		const html = "<div><p><!-- A comment -->Hello, world!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 49,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 43,
						endOffset: 49,
					},
				},
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: false,
					attributes: {},
					sentences: [ {
						text: "Hello, world!",
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 26, endOffset: 31 } },
							{ text: ",", sourceCodeRange: { startOffset: 31, endOffset: 32 } },
							{ text: " ", sourceCodeRange: { startOffset: 32, endOffset: 33 } },
							{ text: "world", sourceCodeRange: { startOffset: 33, endOffset: 38 } },
							{ text: "!", sourceCodeRange: { startOffset: 38, endOffset: 39 } },
						],
						sourceCodeRange: { startOffset: 26, endOffset: 39 },
					} ],
					childNodes: [
						{
							name: "#comment",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: { startOffset: 8, endOffset: 26 },
						},
						{
							name: "#text",
							value: "Hello, world!",
						} ],
					sourceCodeLocation: {
						startOffset: 5,
						endOffset: 43,
						startTag: {
							startOffset: 5,
							endOffset: 8,
						},
						endTag: {
							startOffset: 39,
							endOffset: 43,
						},
					},
				} ],
			} ],
		} );
	} );
	it( "parses an HTML text with a comment within a sentence", () => {
		const html = "<div><p>Hello, <!-- A comment --> world!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 50,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 44,
						endOffset: 50,
					},
				},
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: false,
					attributes: {},
					sentences: [ {
						text: "Hello,  world!",
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 8, endOffset: 13 } },
							{ text: ",", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
							{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
							{ text: " ", sourceCodeRange: { startOffset: 33, endOffset: 34 } },
							{ text: "world", sourceCodeRange: { startOffset: 34, endOffset: 39 } },
							{ text: "!", sourceCodeRange: { startOffset: 39, endOffset: 40 } },
						],
						sourceCodeRange: { startOffset: 8, endOffset: 40 },
					} ],
					childNodes: [
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
					sourceCodeLocation: {
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
					},
				} ],
			} ],
		} );
	} );
	// Currently the token offsets for the second sentence are not calculated correctly.
	xit( "parses an HTML text with a code element within a paragraph", () => {
		const html = "<div><p>Hello code! <code>array.push( something )</code> Hello world!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "div",
					sourceCodeLocation: {
						endOffset: 79,
						endTag: {
							endOffset: 79,
							startOffset: 73,
						},
						startOffset: 0,
						startTag: {
							endOffset: 5,
							startOffset: 0,
						},
					},
					attributes: {},
					childNodes: [
						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "Hello code! ",
								},
								{
									name: "#text",
									value: " Hello world!",
								},
							],
							sentences: [
								{
									text: "Hello code!",
									tokens: [
										{
											sourceCodeRange: {
												endOffset: 13,
												startOffset: 8,
											},
											text: "Hello",
										},
										{
											sourceCodeRange: {
												endOffset: 14,
												startOffset: 13,
											},
											text: " ",
										},
										{
											sourceCodeRange: {
												endOffset: 18,
												startOffset: 14,
											},
											text: "code",
										},
										{
											sourceCodeRange: {
												endOffset: 19,
												startOffset: 18,
											},
											text: "!",
										},
									],
									sourceCodeRange: {
										endOffset: 19,
										startOffset: 8,
									},
								},
								{
									text: "  Hello world!",
									tokens: [
										{
											sourceCodeRange: {
												startOffset: 19,
												endOffset: 20,
											},
											text: " ",
										},
										{
											sourceCodeRange: {
												startOffset: 56,
												endOffset: 57,
											},
											text: " ",
										},
										{
											sourceCodeRange: {
												startOffset: 57,
												endOffset: 62,
											},
											text: "Hello",
										},
										{
											sourceCodeRange: {
												startOffset: 62,
												endOffset: 63,
											},
											text: " ",
										},
										{
											sourceCodeRange: {
												startOffset: 63,
												endOffset: 68,
											},
											text: "world",
										},
										{
											sourceCodeRange: {
												startOffset: 68,
												endOffset: 69,
											},
											text: "!",
										},
									],
									sourceCodeRange: {
										endOffset: 69,
										startOffset: 19,
									},
								},
							],
							sourceCodeLocation: {
								endOffset: 73,
								endTag: {
									endOffset: 73,
									startOffset: 69,
								},
								startOffset: 5,
								startTag: {
									endOffset: 8,
									startOffset: 5,
								},
							},
						},
					],
				},
			],
		} );
	} );
	it( "parses an HTML text with a code element within a sentence", () => {
		const html = "<div><p>Hello <code>array.push( something )</code> code!</p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 66,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 60,
						endOffset: 66,
					},
				},
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: false,
					attributes: {},
					sentences: [ {
						text: "Hello  code!",
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 8, endOffset: 13 } },
							{ text: " ", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
							{ text: " ", sourceCodeRange: { startOffset: 50, endOffset: 51 } },
							{ text: "code", sourceCodeRange: { startOffset: 51, endOffset: 55 } },
							{ text: "!", sourceCodeRange: { startOffset: 55, endOffset: 56 } },
						],
						sourceCodeRange: { startOffset: 8, endOffset: 56 },
					} ],
					childNodes: [
						{
							name: "#text",
							value: "Hello ",
						},
						{
							name: "#text",
							value: " code!",
						},
					],
					sourceCodeLocation: {
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
					},
				} ],
			} ],
		} );
	} );
	it( "parses an HTML text with a code element with a child node within a sentence", () => {
		const html = "<p>Some text and code <code><strong>console.log</strong>( code )</code></p>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
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
					],
					sentences: [
						{
							text: "Some text and code ",
							tokens: [
								{
									sourceCodeRange: {
										startOffset: 3,
										endOffset: 7,
									},
									text: "Some",
								},
								{
									sourceCodeRange: {
										startOffset: 7,
										endOffset: 8,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										startOffset: 8,
										endOffset: 12,
									},
									text: "text",
								},
								{
									sourceCodeRange: {
										startOffset: 12,
										endOffset: 13,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										startOffset: 13,
										endOffset: 16,
									},
									text: "and",
								},
								{
									sourceCodeRange: {
										startOffset: 16,
										endOffset: 17,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										startOffset: 17,
										endOffset: 21,
									},
									text: "code",
								},
								{
									sourceCodeRange: {
										startOffset: 21,
										endOffset: 22,
									},
									text: " ",
								},
							],
							sourceCodeRange: {
								startOffset: 3,
								endOffset: 22,
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
			name: "#document-fragment",
		} );
	} );
} );
