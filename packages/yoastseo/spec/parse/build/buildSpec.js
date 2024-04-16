import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Paper from "../../../src/values/Paper";
import Factory from "../../../src/helpers/factory";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import splitIntoTokensCustom from "../../../src/languageProcessing/languages/ja/helpers/splitIntoTokensCustom";

describe( "The parse function", () => {
	it( "parses a basic HTML text with HTML entities (&nbsp; and &amp;)", () => {
		const html = "<div><p class='yoast'>Hello,&nbsp;world &amp; beyond!</p></div>";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 63,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 57,
						endOffset: 63,
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
						text: "Hello, world & beyond!",
						sourceCodeRange: { startOffset: 22, endOffset: 53 },
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 22, endOffset: 27 } },
							{ text: ",", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
							{ text: " ", sourceCodeRange: { startOffset: 28, endOffset: 34 } },
							{ text: "world", sourceCodeRange: { startOffset: 34, endOffset: 39 } },
							{ text: " ", sourceCodeRange: { startOffset: 39, endOffset: 40 } },
							{ text: "&", sourceCodeRange: { startOffset: 40, endOffset: 45 } },
							{ text: " ", sourceCodeRange: { startOffset: 45, endOffset: 46 } },
							{ text: "beyond", sourceCodeRange: { startOffset: 46, endOffset: 52 } },
							{ text: "!", sourceCodeRange: { startOffset: 52, endOffset: 53 } },
						],
					} ],
					childNodes: [ {
						name: "#text",
						value: "Hello,#nbsp;world #amp; beyond!",
						sourceCodeRange: { startOffset: 22, endOffset: 53 },
					} ],
					sourceCodeLocation: {
						startOffset: 5,
						endOffset: 57,
						startTag: {
							startOffset: 5,
							endOffset: 22,
						},
						endTag: {
							startOffset: 53,
							endOffset: 57,
						},
					},
				} ],
			} ],
		} );
	} );

	it( "parses a basic Japanese HTML text", () => {
		const html = "<div><p class='yoast'>犬が大好き</p></div>";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ splitIntoTokensCustom: splitIntoTokensCustom, memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );
		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 0,
					endOffset: 37,
					startTag: {
						startOffset: 0,
						endOffset: 5,
					},
					endTag: {
						startOffset: 31,
						endOffset: 37,
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
						text: "犬が大好き",
						sourceCodeRange: { startOffset: 22, endOffset: 27 },
						tokens: [
							{ text: "犬", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
							{ text: "が", sourceCodeRange: { startOffset: 23, endOffset: 24 } },
							{ text: "大好き", sourceCodeRange: { startOffset: 24, endOffset: 27 } },
						],
					} ],
					childNodes: [ {
						name: "#text",
						value: "犬が大好き",
						sourceCodeRange: { startOffset: 22, endOffset: 27 },
					} ],
					sourceCodeLocation: {
						startOffset: 5,
						endOffset: 31,
						startTag: {
							startOffset: 5,
							endOffset: 22,
						},
						endTag: {
							startOffset: 27,
							endOffset: 31,
						},
					},
				} ],
			} ],
		} );
	} );

	it( "adds implicit paragraphs around phrasing content outside of paragraphs and headings", () => {
		const html = "<div>Hello <span>World!</span></div>";
		const paper = new Paper( html );

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
		expect( build( paper, languageProcessor ) ).toEqual( {
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
							sourceCodeRange: { startOffset: 5, endOffset: 11 },
						},
						{
							name: "span",
							attributes: {},
							childNodes: [ {
								name: "#text",
								value: "World!",
								sourceCodeRange: { startOffset: 17, endOffset: 23 },
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
		const paper = new Paper( html );

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
		expect( build( paper, languageProcessor ) ).toEqual( {
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
									sourceCodeRange: { startOffset: 5, endOffset: 11 },
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
									sourceCodeRange: { startOffset: 14, endOffset: 20 },
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
		const paper = new Paper( html );

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
		expect( build( paper, languageProcessor ) ).toEqual( {
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
									sourceCodeRange: { startOffset: 5, endOffset: 8 },
								},
								{
									name: "em",
									attributes: {},
									childNodes: [
										{
											name: "#text",
											value: "long",
											sourceCodeRange: { startOffset: 12, endOffset: 16 },
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
									sourceCodeRange: { startOffset: 21, endOffset: 27 },
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
									sourceCodeRange: { startOffset: 30, endOffset: 36 },
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
									sourceCodeRange: { startOffset: 40, endOffset: 45 },
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
									sourceCodeRange: { startOffset: 48, endOffset: 51 },
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
									sourceCodeRange: { startOffset: 55, endOffset: 60 },
								},
								{
									name: "strong",
									attributes: {},
									childNodes: [
										{
											name: "#text",
											value: "fish",
											sourceCodeRange: { startOffset: 68, endOffset: 72 },
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
									sourceCodeRange: { startOffset: 81, endOffset: 82 },
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
		// <!-- wp:yoast-seo/table-of-contents -->\n
		// 	<div class="wp-block-yoast-seo-table-of-contents yoast-table-of-contents"><h2>Table of contents</h2><ul><li>
		// 	<a href="#h-subheading-1" data-level="2">Subheading 1</a></li><li><a href="#h-subheading-2"
		// 	data-level="2">Subheading 2</a></li></ul></div>\n
		// 	<!-- /wp:yoast-seo/table-of-contents --><p>This is the first sentence.</p>
		const html = "<!-- wp:yoast-seo/table-of-contents -->\n<div class=\"wp-block-yoast-seo-table-of-contents yoast-table-of-contents\">" +
			"<h2>Table of contents</h2><ul><li><a href=\"#h-subheading-1\" data-level=\"2\">Subheading 1</a></li><li><a href=\"#h-subheading-2\" " +
			"data-level=\"2\">Subheading 2</a></li></ul></div>\n<!-- /wp:yoast-seo/table-of-contents --><p>This is the first sentence.</p>";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			attributes: {},
			childNodes: [
				{ name: "#text", sourceCodeRange: { endOffset: 40, startOffset: 39 }, value: "\n" },
				{ name: "#text", sourceCodeRange: { endOffset: 288, startOffset: 287 }, value: "\n" },
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							sourceCodeRange: { endOffset: 358, startOffset: 331 },
							value: "This is the first sentence." },
					],
					isImplicit: false,
					name: "p",
					sentences: [
						{
							sourceCodeRange: { endOffset: 358, startOffset: 331 },
							text: "This is the first sentence.",
							tokens: [
								{ sourceCodeRange: { endOffset: 335, startOffset: 331 }, text: "This" },
								{ sourceCodeRange: { endOffset: 336, startOffset: 335 }, text: " " },
								{ sourceCodeRange: { endOffset: 338, startOffset: 336 }, text: "is" },
								{ sourceCodeRange: { endOffset: 339, startOffset: 338 }, text: " " },
								{ sourceCodeRange: { endOffset: 342, startOffset: 339 }, text: "the" },
								{ sourceCodeRange: { endOffset: 343, startOffset: 342 }, text: " " },
								{ sourceCodeRange: { endOffset: 348, startOffset: 343 }, text: "first" },
								{ sourceCodeRange: { endOffset: 349, startOffset: 348 }, text: " " },
								{ sourceCodeRange: { endOffset: 357, startOffset: 349 }, text: "sentence" },
								{ sourceCodeRange: { endOffset: 358, startOffset: 357 }, text: "." },
							] } ],
					sourceCodeLocation: {
						endOffset: 362,
						endTag: { endOffset: 362, startOffset: 358 },
						startOffset: 328,
						startTag: { endOffset: 331, startOffset: 328 },
					} } ],
			name: "#document-fragment" }
		);
	} );
	it( "parses an HTML text with a Yoast breadcrumbs widget in Elementor, which should be filtered out", () => {
		// HTML: <p id="breadcrumbs"><span><span><a href="https://one.wordpress.test/">Home</a></span></span></p><p>The first sentence</p>
		const html = "<p id=\"breadcrumbs\"><span><span><a href=\"https://one.wordpress.test/\">Home</a></span></span></p><p>The first sentence</p>";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual(
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
								sourceCodeRange: { startOffset: 99, endOffset: 117 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
									sourceCodeRange: { startOffset: 53, endOffset: 67 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
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
					sourceCodeRange: { startOffset: 48, endOffset: 61 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
							name: "#text",
							value: "Hello, world!",
							sourceCodeRange: { startOffset: 26, endOffset: 39 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
							sourceCodeRange: { startOffset: 8, endOffset: 15 },
						},
						{
							name: "#text",
							value: " world!",
							sourceCodeRange: { startOffset: 33, endOffset: 40 },
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

	it( "parses an HTML text with a code element within a paragraph", () => {
		const html = "<div><p>Hello code! <code>array.push( something )</code> Hello world!</p></div>";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
									sourceCodeRange: { startOffset: 8, endOffset: 20 },
								},
								{
									name: "#text",
									value: " Hello world!",
									sourceCodeRange: { startOffset: 56, endOffset: 69 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
							sourceCodeRange: { startOffset: 8, endOffset: 14 },
						},
						{
							name: "#text",
							value: " code!",
							sourceCodeRange: { startOffset: 50, endOffset: 56 },
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
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
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
							sourceCodeRange: { startOffset: 3, endOffset: 22 },
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
	it( "also parses blocks when the blocks array is available inside Paper, " +
		"the available block client id should also be added to the childNodes", () => {
		const html = "<!-- wp:paragraph -->\n" +
			"<p>The red panda's coat is mainly red or orange-brown with a black belly and legs.</p>\n" +
			"<!-- /wp:paragraph -->\n" +
			"\n" +
			"<!-- wp:list -->\n" +
			"<ul><!-- wp:list-item -->\n" +
			"<li>giant panda</li>\n" +
			"<!-- /wp:list-item -->\n" +
			"\n" +
			"<!-- wp:list-item -->\n" +
			"<li>red panda</li>\n" +
			"<!-- /wp:list-item --></ul>\n" +
			"<!-- /wp:list -->";
		const paper = new Paper( html, { wpBlocks: [
			{
				clientId: "da950985-3903-479c-92f5-9a98bcec51e9",
				name: "core/paragraph",
				isValid: true,
				originalContent: "<p>The red panda's coat is mainly red or orange-brown with a black belly and legs.</p>",
				validationIssues: [],
				attributes: {
					content: "The red panda's coat is mainly red or orange-brown with a black belly and legs.",
					dropCap: false,
				},
				innerBlocks: [],
			},
			{
				clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
				name: "core/list",
				isValid: true,
				originalContent: "<ul>\n\n</ul>",
				validationIssues: [],
				attributes: {
					ordered: false,
					values: "",
				},
				innerBlocks: [
					{
						clientId: "b45eed06-594b-468e-8723-1f597689c300",
						name: "core/list-item",
						isValid: true,
						originalContent: "<li>giant panda</li>",
						validationIssues: [],
						attributes: {
							content: "giant panda",
						},
						innerBlocks: [],
					},
					{
						clientId: "f8a22538-9e9d-4862-968d-524580f5d8ce",
						name: "core/list-item",
						isValid: true,
						originalContent: "<li>red panda</li>",
						validationIssues: [],
						attributes: {
							content: "red panda",
						},
						innerBlocks: [],
					},
				],
			},
		] } );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );
		expect( build( paper, languageProcessor ) ).toEqual(
			{
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{ name: "#text", value: "\n",
						sourceCodeRange: { startOffset: 21, endOffset: 22 } },
					{
						name: "p",
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "The red panda's coat is mainly red or orange-brown with a black belly and legs.",
								sourceCodeRange: { startOffset: 25, endOffset: 104 },
								clientId: "da950985-3903-479c-92f5-9a98bcec51e9",
							},
						],
						sourceCodeLocation: {
							startTag: { startOffset: 22, endOffset: 25 },
							endTag: { startOffset: 104, endOffset: 108 },
							startOffset: 22,
							endOffset: 108,
						},
						isImplicit: false,
						clientId: "da950985-3903-479c-92f5-9a98bcec51e9",
						sentences: [
							{
								text: "The red panda's coat is mainly red or orange-brown with a black belly and legs.",
								tokens: [
									{ text: "The", sourceCodeRange: { startOffset: 25, endOffset: 28 } },
									{ text: " ", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
									{ text: "red", sourceCodeRange: { startOffset: 29, endOffset: 32 } },
									{ text: " ", sourceCodeRange: { startOffset: 32, endOffset: 33 } },
									{ text: "panda's", sourceCodeRange: { startOffset: 33, endOffset: 40 } },
									{ text: " ", sourceCodeRange: { startOffset: 40, endOffset: 41 } },
									{ text: "coat", sourceCodeRange: { startOffset: 41, endOffset: 45 } },
									{ text: " ", sourceCodeRange: { startOffset: 45, endOffset: 46 } },
									{ text: "is", sourceCodeRange: { startOffset: 46, endOffset: 48 } },
									{ text: " ", sourceCodeRange: { startOffset: 48, endOffset: 49 } },
									{ text: "mainly", sourceCodeRange: { startOffset: 49, endOffset: 55 } },
									{ text: " ", sourceCodeRange: { startOffset: 55, endOffset: 56 } },
									{ text: "red", sourceCodeRange: { startOffset: 56, endOffset: 59 } },
									{ text: " ", sourceCodeRange: { startOffset: 59, endOffset: 60 } },
									{ text: "or", sourceCodeRange: { startOffset: 60, endOffset: 62 } },
									{ text: " ", sourceCodeRange: { startOffset: 62, endOffset: 63 } },
									{ text: "orange", sourceCodeRange: { startOffset: 63, endOffset: 69 } },
									{ text: "-", sourceCodeRange: { startOffset: 69, endOffset: 70 } },
									{ text: "brown", sourceCodeRange: { startOffset: 70, endOffset: 75 } },
									{ text: " ", sourceCodeRange: { startOffset: 75, endOffset: 76 } },
									{ text: "with", sourceCodeRange: { startOffset: 76, endOffset: 80 } },
									{ text: " ", sourceCodeRange: { startOffset: 80, endOffset: 81 } },
									{ text: "a", sourceCodeRange: { startOffset: 81, endOffset: 82 } },
									{ text: " ", sourceCodeRange: { startOffset: 82, endOffset: 83 } },
									{ text: "black", sourceCodeRange: { startOffset: 83, endOffset: 88 } },
									{ text: " ", sourceCodeRange: { startOffset: 88, endOffset: 89 } },
									{ text: "belly", sourceCodeRange: { startOffset: 89, endOffset: 94 } },
									{ text: " ", sourceCodeRange: { startOffset: 94, endOffset: 95 } },
									{ text: "and", sourceCodeRange: { startOffset: 95, endOffset: 98 } },
									{ text: " ", sourceCodeRange: { startOffset: 98, endOffset: 99 } },
									{ text: "legs", sourceCodeRange: { startOffset: 99, endOffset: 103 } },
									{ text: ".", sourceCodeRange: { startOffset: 103, endOffset: 104 } },
								],
								sourceCodeRange: { startOffset: 25, endOffset: 104 },
							},
						],
					},
					{ name: "#text", value: "\n",
						sourceCodeRange: { startOffset: 108, endOffset: 109 } },
					{ name: "#text", value: "\n\n",
						sourceCodeRange: { startOffset: 131, endOffset: 133 } },
					{ name: "#text", value: "\n",
						sourceCodeRange: { startOffset: 149, endOffset: 150 } },
					{
						name: "ul",
						attributes: {},
						childNodes: [
							{ name: "#text", value: "\n", clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
								sourceCodeRange: { startOffset: 175, endOffset: 176 } },
							{
								name: "li",
								attributes: {},
								childNodes: [
									{
										name: "p",
										attributes: {},
										childNodes: [
											{ name: "#text", value: "giant panda", clientId: "b45eed06-594b-468e-8723-1f597689c300",
												sourceCodeRange: { startOffset: 180, endOffset: 191 } },
										],
										sourceCodeLocation: { startOffset: 180, endOffset: 191 },
										isImplicit: true,
										clientId: "b45eed06-594b-468e-8723-1f597689c300",
										sentences: [
											{
												text: "giant panda",
												tokens: [
													{ text: "giant", sourceCodeRange: { startOffset: 180, endOffset: 185 } },
													{ text: " ", sourceCodeRange: { startOffset: 185, endOffset: 186 } },
													{ text: "panda", sourceCodeRange: { startOffset: 186, endOffset: 191 } },
												],
												sourceCodeRange: { startOffset: 180, endOffset: 191 },
											},
										],
									},
								],
								sourceCodeLocation: {
									startTag: { startOffset: 176, endOffset: 180 },
									endTag: { startOffset: 191, endOffset: 196 },
									startOffset: 176,
									endOffset: 196,
								},
								clientId: "b45eed06-594b-468e-8723-1f597689c300",
							},
							{ name: "#text", value: "\n", clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
								sourceCodeRange: { startOffset: 196, endOffset: 197 } },
							{ name: "#text", value: "\n\n", clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
								sourceCodeRange: { startOffset: 219, endOffset: 221 } },
							{ name: "#text", value: "\n", clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
								sourceCodeRange: { startOffset: 242, endOffset: 243 } },
							{
								name: "li",
								attributes: {},
								childNodes: [
									{
										name: "p",
										attributes: {},
										childNodes: [
											{ name: "#text", value: "red panda", clientId: "f8a22538-9e9d-4862-968d-524580f5d8ce",
												sourceCodeRange: { startOffset: 247, endOffset: 256 } },
										],
										sourceCodeLocation: { startOffset: 247, endOffset: 256 },
										isImplicit: true,
										clientId: "f8a22538-9e9d-4862-968d-524580f5d8ce",
										sentences: [
											{
												text: "red panda",
												tokens: [
													{ text: "red", sourceCodeRange: { startOffset: 247, endOffset: 250 } },
													{ text: " ", sourceCodeRange: { startOffset: 250, endOffset: 251 } },
													{ text: "panda", sourceCodeRange: { startOffset: 251, endOffset: 256 } },
												],
												sourceCodeRange: { startOffset: 247, endOffset: 256 },
											},
										],
									},
								],
								sourceCodeLocation: {
									startTag: { startOffset: 243, endOffset: 247 },
									endTag: { startOffset: 256, endOffset: 261 },
									startOffset: 243, endOffset: 261,
								},
								clientId: "f8a22538-9e9d-4862-968d-524580f5d8ce",
							},
							{ name: "#text", value: "\n", clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
								sourceCodeRange: { startOffset: 261, endOffset: 262 } },
						],
						sourceCodeLocation: {
							startTag: { startOffset: 150, endOffset: 154 },
							endTag: { startOffset: 284, endOffset: 289 },
							startOffset: 150,
							endOffset: 289,
						},
						clientId: "ce5c002f-eea2-4a92-be4a-6fd25e947f45",
					},
					{ name: "#text", value: "\n",
						sourceCodeRange: { startOffset: 289, endOffset: 290 } },
				],
			}
		);
	} );
} );

describe( "parsing html with Yoast blocks that enter the Paper as html comments", () => {
	it( "parses an HTML text with a Yoast breadcrumbs block", () => {
		const html = "<!-- wp:yoast-seo/breadcrumbs /-->" +
			"<!-- wp:paragraph -->\n" +
			"<p>The Norwegian Forest cat is adapted to survive Norway's cold weather.</p>\n" +
			"<!-- /wp:paragraph -->";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{ name: "#text", value: "\n", sourceCodeRange: { startOffset: 55, endOffset: 56 } },
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "The Norwegian Forest cat is adapted to survive Norway's cold weather.",
							sourceCodeRange: { startOffset: 59, endOffset: 128 } },
					],
					isImplicit: false,
					name: "p",
					sentences: [
						{
							sourceCodeRange: {
								endOffset: 128,
								startOffset: 59,
							},
							text: "The Norwegian Forest cat is adapted to survive Norway's cold weather.",
							tokens: [
								{ sourceCodeRange: { endOffset: 62, startOffset: 59 }, text: "The" },
								{ sourceCodeRange: { endOffset: 63, startOffset: 62 }, text: " " },
								{ sourceCodeRange: { endOffset: 72, startOffset: 63 }, text: "Norwegian" },
								{ sourceCodeRange: { endOffset: 73, startOffset: 72 }, text: " " },
								{ sourceCodeRange: { endOffset: 79, startOffset: 73 }, text: "Forest" },
								{ sourceCodeRange: { endOffset: 80, startOffset: 79 }, text: " " },
								{ sourceCodeRange: { endOffset: 83, startOffset: 80 }, text: "cat" },
								{ sourceCodeRange: { endOffset: 84, startOffset: 83 }, text: " " },
								{ sourceCodeRange: { endOffset: 86, startOffset: 84 }, text: "is" },
								{ sourceCodeRange: { endOffset: 87, startOffset: 86 }, text: " " },
								{ sourceCodeRange: { endOffset: 94, startOffset: 87 }, text: "adapted" },
								{ sourceCodeRange: { endOffset: 95, startOffset: 94 }, text: " " },
								{ sourceCodeRange: { endOffset: 97, startOffset: 95 }, text: "to" },
								{ sourceCodeRange: { endOffset: 98, startOffset: 97 }, text: " " },
								{ sourceCodeRange: { endOffset: 105, startOffset: 98 }, text: "survive" },
								{ sourceCodeRange: { endOffset: 106, startOffset: 105 }, text: " " },
								{ sourceCodeRange: { endOffset: 114, startOffset: 106 }, text: "Norway's" },
								{ sourceCodeRange: { endOffset: 115, startOffset: 114 }, text: " " },
								{ sourceCodeRange: { endOffset: 119, startOffset: 115 }, text: "cold" },
								{ sourceCodeRange: { endOffset: 120, startOffset: 119 }, text: " " },
								{ sourceCodeRange: { endOffset: 127, startOffset: 120 }, text: "weather" },
								{ sourceCodeRange: { endOffset: 128, startOffset: 127 }, text: "." },
							],
						},
					],
					sourceCodeLocation: {
						endOffset: 132,
						endTag: { endOffset: 132, startOffset: 128 },
						startOffset: 56,
						startTag: { endOffset: 59, startOffset: 56 },
					},
				},
				{ name: "#text", value: "\n", sourceCodeRange: { startOffset: 132, endOffset: 133 } },
			],
		} );
	} );

	it( "parses an HTML text with a Yoast siblings block", () => {
		const html = "<p>Hello, world!</p><!-- wp:yoast-seo/siblings /-->";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "Hello, world!",
							sourceCodeRange: { startOffset: 3, endOffset: 16 },
						},
					],
					isImplicit: false,
					name: "p",
					sentences: [
						{
							sourceCodeRange: {
								endOffset: 16,
								startOffset: 3,
							},
							text: "Hello, world!",
							tokens: [
								{
									sourceCodeRange: {
										endOffset: 8,
										startOffset: 3,
									},
									text: "Hello",
								},
								{
									sourceCodeRange: {
										endOffset: 9,
										startOffset: 8,
									},
									text: ",",
								},
								{
									sourceCodeRange: {
										endOffset: 10,
										startOffset: 9,
									},
									text: " ",
								},
								{
									sourceCodeRange: {
										endOffset: 15,
										startOffset: 10,
									},
									text: "world",
								},
								{
									sourceCodeRange: {
										endOffset: 16,
										startOffset: 15,
									},
									text: "!",
								},
							],
						},
					],
					sourceCodeLocation: {
						endOffset: 20,
						endTag: {
							endOffset: 20,
							startOffset: 16,
						},
						startOffset: 0,
						startTag: {
							endOffset: 3,
							startOffset: 0,
						},
					},
				},
			],
		} );
	} );

	it( "parses an HTML text with a Yoast subpages block", () => {
		const html = "<div>The Norwegian Forest cat is strongly built and larger than an average cat.</div><!-- wp:yoast-seo/subpages /-->";
		const paper = new Paper( html );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( paper, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "The Norwegian Forest cat is strongly built and larger than an average cat.",
									sourceCodeRange: { startOffset: 5, endOffset: 79 },
								},
							],
							isImplicit: true,
							name: "p",
							sentences: [
								{
									sourceCodeRange: {
										endOffset: 79,
										startOffset: 5,
									},
									text: "The Norwegian Forest cat is strongly built and larger than an average cat.",
									tokens: [
										{ sourceCodeRange: { endOffset: 8, startOffset: 5 }, text: "The" },
										{ sourceCodeRange: { endOffset: 9, startOffset: 8 }, text: " " },
										{ sourceCodeRange: { endOffset: 18, startOffset: 9 }, text: "Norwegian" },
										{ sourceCodeRange: { endOffset: 19, startOffset: 18 }, text: " " },
										{ sourceCodeRange: { endOffset: 25, startOffset: 19 }, text: "Forest" },
										{ sourceCodeRange: { endOffset: 26, startOffset: 25 }, text: " " },
										{ sourceCodeRange: { endOffset: 29, startOffset: 26 }, text: "cat" },
										{ sourceCodeRange: { endOffset: 30, startOffset: 29 }, text: " " },
										{ sourceCodeRange: { endOffset: 32, startOffset: 30 }, text: "is" },
										{ sourceCodeRange: { endOffset: 33, startOffset: 32 }, text: " " },
										{ sourceCodeRange: { endOffset: 41, startOffset: 33 }, text: "strongly" },
										{ sourceCodeRange: { endOffset: 42, startOffset: 41 }, text: " " },
										{ sourceCodeRange: { endOffset: 47, startOffset: 42 }, text: "built" },
										{ sourceCodeRange: { endOffset: 48, startOffset: 47 }, text: " " },
										{ sourceCodeRange: { endOffset: 51, startOffset: 48 }, text: "and" },
										{ sourceCodeRange: { endOffset: 52, startOffset: 51 }, text: " " },
										{ sourceCodeRange: { endOffset: 58, startOffset: 52 }, text: "larger" },
										{ sourceCodeRange: { endOffset: 59, startOffset: 58 }, text: " " },
										{ sourceCodeRange: { endOffset: 63, startOffset: 59 }, text: "than" },
										{ sourceCodeRange: { endOffset: 64, startOffset: 63 }, text: " " },
										{ sourceCodeRange: { endOffset: 66, startOffset: 64 }, text: "an" },
										{ sourceCodeRange: { endOffset: 67, startOffset: 66 }, text: " " },
										{ sourceCodeRange: { endOffset: 74, startOffset: 67 }, text: "average" },
										{ sourceCodeRange: { endOffset: 75, startOffset: 74 }, text: " " },
										{ sourceCodeRange: { endOffset: 78, startOffset: 75 }, text: "cat" },
										{ sourceCodeRange: { endOffset: 79, startOffset: 78 }, text: "." },
									],
								},
							],
							sourceCodeLocation: { endOffset: 79, startOffset: 5 },
						},
					],
					name: "div",
					sourceCodeLocation: {
						endOffset: 85,
						endTag: { endOffset: 85, startOffset: 79 },
						startOffset: 0,
						startTag: { endOffset: 5, startOffset: 0 },
					},
				},
			],
		} );
	} );

	it( "parses an HTML text with a Yoast FAQ block: " +
		"The block client id, attribute id, and the information whether a child node is " +
		"the first section in the sub-block should be added to the tree", () => {
		const html = "<!-- wp:yoast/faq-block {\"questions\":[{\"id\":\"faq-question-1689322642789\",\"question\":,\"answer\":}},\"" +
			" is is relative to red panda\"],\"jsonQuestion\":\"What is giant panda\",\"jsonAnswer\":\"Giant " +
			"\u003cstrong\u003epanda\u003c/strong\u003e " +
			"is is relative to red panda\"},{\"id\":\"faq-question-1689322667728\",\"question\":,\"answer\":,\"jsonQuestion\":\"Test\",\"jsonAnswer" +
			"\":\"Test\"},{\"id\":\"faq-question-1689936392675\",\"question\":,\"answer\":[],\"jsonQuestion\":\"giant panda is silly\"," +
			"\"jsonAnswer\":\"\"}]} -->\n" +
			"<div class=\"schema-faq wp-block-yoast-faq-block\"><div class=\"schema-faq-section\" id=\"faq-question-1689322642789\">" +
			"<strong class=\"schema-faq-question\">What is giant panda</strong> <p class=\"schema-faq-answer\">" +
			"Giant <strong>panda</strong> is is relative to red panda</p> </div> <div class=\"schema-faq-section\" " +
			"id=\"faq-question-1689322667728\">" +
			"<strong class=\"schema-faq-question\">Test</strong> <p class=\"schema-faq-answer\">Test</p> </div> " +
			"<div class=\"schema-faq-section\" id=\"faq-question-1689936392675\"><strong class=\"schema-faq-question\">" +
			"giant panda is silly</strong> <p class=\"schema-faq-answer\"></p> </div> </div>\n" +
			"<!-- /wp:yoast/faq-block -->";
		const paper = new Paper( html, {
			wpBlocks: [
				{
					clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
					name: "yoast/faq-block",
					isValid: true,
					originalContent: "<div class=\"schema-faq wp-block-yoast-faq-block\"><div class=\"schema-faq-section\"" +
						" id=\"faq-question-1689322642789\"><strong class=\"schema-faq-question\">" +
						"What is giant panda</strong> <p class=\"schema-faq-answer\">Giant <strong>panda" +
						"</strong> is relative to red panda</p> </div> <div class=\"schema-faq-section\" " +
						"id=\"faq-question-1689322667728\"><strong class=\"schema-faq-question\">" +
						"Test</strong> <p class=\"schema-faq-answer\">Tets</p> </div> <div class=\"schema-faq-section\" " +
						"id=\"faq-question-1689936392675\"><strong class=\"schema-faq-question\">giant panda is silly</strong> " +
						"<p class=\"schema-faq-answer\"></p> </div> </div>",
					validationIssues: [],
					attributes: {
						questions: [
							{
								id: "faq-question-1689322642789",
								question: [ "What is giant panda" ],
								answer: [ "Giant ", { type: "strong", props: { children: [ "panda" ] } }, " is relative to red panda" ],
								jsonQuestion: "What is giant panda",
								jsonAnswer: "Giant <strong>panda</strong> is is relative to red panda",
							},
							{
								id: "faq-question-1689322667728",
								question: [ "Test" ],
								answer: [ "Tests" ],
								jsonQuestion: "Test",
								jsonAnswer: "Tests",
							},
							{
								id: "faq-question-1689936392675",
								question: [ "giant panda is silly" ],
								answer: [],
								jsonQuestion: "giant panda is silly",
								jsonAnswer: "",
							},
						],
					},
					innerBlocks: [],
					startOffset: 2510,
					contentOffset: 2963,
				},
			],
		} );

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );
		expect( build( paper, languageProcessor ) ).toEqual(
			{
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{ name: "#text", value: "\n", sourceCodeRange: { startOffset: 458, endOffset: 459 } },
					{
						name: "div",
						attributes: {
							"class": new Set( [ "schema-faq", "wp-block-yoast-faq-block" ] ),
						},
						childNodes: [
							{
								name: "div",
								attributes: { "class": new Set( [ "schema-faq-section" ] ), id: "faq-question-1689322642789" },
								childNodes: [
									{
										name: "p",
										attributes: {},
										childNodes: [
											{
												name: "strong",
												attributes: { "class": new Set( [ "schema-faq-question" ] ) },
												childNodes: [
													{ name: "#text", value: "What is giant panda",
														clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
														sourceCodeRange: { startOffset: 608, endOffset: 627 } },
												],
												sourceCodeLocation: {
													startTag: { startOffset: 572, endOffset: 608 },
													endTag: { startOffset: 627, endOffset: 636 },
													startOffset: 572,
													endOffset: 636,
												},
												clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
											},
										],
										sourceCodeLocation: { startOffset: 572, endOffset: 636 },
										isImplicit: true,
										attributeId: "faq-question-1689322642789",
										isFirstSection: true,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [
											{
												text: "What is giant panda",
												tokens: [
													{ text: "What", sourceCodeRange: { startOffset: 608, endOffset: 612 } },
													{ text: " ", sourceCodeRange: { startOffset: 612, endOffset: 613 } },
													{ text: "is", sourceCodeRange: { startOffset: 613, endOffset: 615 } },
													{ text: " ", sourceCodeRange: { startOffset: 615, endOffset: 616 } },
													{ text: "giant", sourceCodeRange: { startOffset: 616, endOffset: 621 } },
													{ text: " ", sourceCodeRange: { startOffset: 621, endOffset: 622 } },
													{ text: "panda", sourceCodeRange: { startOffset: 622, endOffset: 627 } },
												],
												sourceCodeRange: { startOffset: 608, endOffset: 627 },
											},
										],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 636, endOffset: 637 } },
									{
										name: "p",
										attributes: { "class": new Set( [ "schema-faq-answer" ] ) },
										childNodes: [
											{ name: "#text", value: "Giant ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
												sourceCodeRange: { startOffset: 666, endOffset: 672 } },
											{
												name: "strong",
												attributes: {},
												childNodes: [
													{ name: "#text", value: "panda", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
														sourceCodeRange: { startOffset: 680, endOffset: 685 } },
												],
												sourceCodeLocation: {
													startTag: { startOffset: 672, endOffset: 680 },
													endTag: { startOffset: 685, endOffset: 694 },
													startOffset: 672,
													endOffset: 694,
												},
												clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
											},
											{ name: "#text", value: " is is relative to red panda",
												clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
												sourceCodeRange: { startOffset: 694, endOffset: 722 } },
										],
										sourceCodeLocation: {
											startTag: { startOffset: 637, endOffset: 666 },
											endTag: { startOffset: 722, endOffset: 726 },
											startOffset: 637,
											endOffset: 726,
										},
										isImplicit: false,
										attributeId: "faq-question-1689322642789",
										isFirstSection: false,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [
											{
												text: "Giant panda is is relative to red panda",
												tokens: [
													{ text: "Giant", sourceCodeRange: { startOffset: 666, endOffset: 671 } },
													{ text: " ", sourceCodeRange: { startOffset: 671, endOffset: 672 } },
													{ text: "panda", sourceCodeRange: { startOffset: 680, endOffset: 685 } },
													{ text: " ", sourceCodeRange: { startOffset: 694, endOffset: 695 } },
													{ text: "is", sourceCodeRange: { startOffset: 695, endOffset: 697 } },
													{ text: " ", sourceCodeRange: { startOffset: 697, endOffset: 698 } },
													{ text: "is", sourceCodeRange: { startOffset: 698, endOffset: 700 } },
													{ text: " ", sourceCodeRange: { startOffset: 700, endOffset: 701 } },
													{ text: "relative", sourceCodeRange: { startOffset: 701, endOffset: 709 } },
													{ text: " ", sourceCodeRange: { startOffset: 709, endOffset: 710 } },
													{ text: "to", sourceCodeRange: { startOffset: 710, endOffset: 712 } },
													{ text: " ", sourceCodeRange: { startOffset: 712, endOffset: 713 } },
													{ text: "red", sourceCodeRange: { startOffset: 713, endOffset: 716 } },
													{ text: " ", sourceCodeRange: { startOffset: 716, endOffset: 717 } },
													{ text: "panda", sourceCodeRange: { startOffset: 717, endOffset: 722 } },
												],
												sourceCodeRange: { startOffset: 666, endOffset: 722 },
											},
										],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 726, endOffset: 727 } },
								],
								sourceCodeLocation: {
									startTag: { startOffset: 508, endOffset: 572 },
									endTag: { startOffset: 727, endOffset: 733 },
									startOffset: 508,
									endOffset: 733,
								},
								clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
							},
							{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
								sourceCodeRange: { startOffset: 733, endOffset: 734 } },
							{
								name: "div",
								attributes: { "class": new Set( [ "schema-faq-section" ] ), id: "faq-question-1689322667728" },
								childNodes: [
									{
										name: "p",
										attributes: {},
										childNodes: [
											{
												name: "strong",
												attributes: { "class": new Set( [ "schema-faq-question" ] ) },
												childNodes: [
													{ name: "#text", value: "Test", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
														sourceCodeRange: { startOffset: 834, endOffset: 838 } },
												],
												sourceCodeLocation: {
													startTag: { startOffset: 798, endOffset: 834 },
													endTag: { startOffset: 838, endOffset: 847 },
													startOffset: 798,
													endOffset: 847,
												},
												clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
											},
										],
										sourceCodeLocation: { startOffset: 798, endOffset: 847 },
										isImplicit: true,
										attributeId: "faq-question-1689322667728",
										isFirstSection: true,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [
											{
												text: "Test",
												tokens: [
													{ text: "Test", sourceCodeRange: { startOffset: 834, endOffset: 838 } },
												],
												sourceCodeRange: { startOffset: 834, endOffset: 838 },
											},
										],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 847, endOffset: 848 } },
									{
										name: "p",
										attributes: { "class": new Set( [ "schema-faq-answer" ] ) },
										childNodes: [
											{ name: "#text", value: "Test", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
												sourceCodeRange: { startOffset: 877, endOffset: 881 } },
										],
										sourceCodeLocation: {
											startTag: { startOffset: 848, endOffset: 877 },
											endTag: { startOffset: 881, endOffset: 885 },
											startOffset: 848,
											endOffset: 885,
										},
										isImplicit: false,
										attributeId: "faq-question-1689322667728",
										isFirstSection: false,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [
											{
												text: "Test",
												tokens: [
													{ text: "Test", sourceCodeRange: { startOffset: 877, endOffset: 881 } },
												],
												sourceCodeRange: { startOffset: 877, endOffset: 881 },
											},
										],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 885, endOffset: 886 } },
								],
								sourceCodeLocation: {
									startTag: { startOffset: 734, endOffset: 798 },
									endTag: { startOffset: 886, endOffset: 892 },
									startOffset: 734,
									endOffset: 892,
								},
								clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
							},
							{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
								sourceCodeRange: { startOffset: 892, endOffset: 893 } },
							{
								name: "div",
								attributes: { "class": new Set( [ "schema-faq-section" ] ), id: "faq-question-1689936392675" },
								childNodes: [
									{
										name: "p",
										attributes: {},
										childNodes: [
											{
												name: "strong",
												attributes: { "class": new Set( [ "schema-faq-question" ] ) },
												childNodes: [
													{ name: "#text", value: "giant panda is silly",
														clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
														sourceCodeRange: { startOffset: 993, endOffset: 1013 } },
												],
												sourceCodeLocation: {
													startTag: { startOffset: 957, endOffset: 993 },
													endTag: { startOffset: 1013, endOffset: 1022 },
													startOffset: 957,
													endOffset: 1022,
												},
												clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
											},
										],
										sourceCodeLocation: { startOffset: 957, endOffset: 1022 },
										isImplicit: true,
										attributeId: "faq-question-1689936392675",
										isFirstSection: true,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [
											{
												text: "giant panda is silly",
												tokens: [
													{ text: "giant", sourceCodeRange: { startOffset: 993, endOffset: 998 } },
													{ text: " ", sourceCodeRange: { startOffset: 998, endOffset: 999 } },
													{ text: "panda", sourceCodeRange: { startOffset: 999, endOffset: 1004 } },
													{ text: " ", sourceCodeRange: { startOffset: 1004, endOffset: 1005 } },
													{ text: "is", sourceCodeRange: { startOffset: 1005, endOffset: 1007 } },
													{ text: " ", sourceCodeRange: { startOffset: 1007, endOffset: 1008 } },
													{ text: "silly", sourceCodeRange: { startOffset: 1008, endOffset: 1013 } },
												],
												sourceCodeRange: { startOffset: 993, endOffset: 1013 },
											},
										],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 1022, endOffset: 1023 } },
									{
										name: "p",
										attributes: { "class": new Set( [ "schema-faq-answer" ] ) },
										childNodes: [],
										sourceCodeLocation: {
											startTag: { startOffset: 1023, endOffset: 1052 },
											endTag: { startOffset: 1052, endOffset: 1056 },
											startOffset: 1023,
											endOffset: 1056,
										},
										isImplicit: false,
										attributeId: "faq-question-1689936392675",
										isFirstSection: false,
										clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sentences: [],
									},
									{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
										sourceCodeRange: { startOffset: 1056, endOffset: 1057 } },
								],
								sourceCodeLocation: {
									startTag: { startOffset: 893, endOffset: 957 },
									endTag: { startOffset: 1057, endOffset: 1063 },
									startOffset: 893,
									endOffset: 1063,
								},
								clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
							},
							{ name: "#text", value: " ", clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
								sourceCodeRange: { startOffset: 1063, endOffset: 1064 } },
						],
						sourceCodeLocation: {
							startTag: { startOffset: 459, endOffset: 508 },
							endTag: { startOffset: 1064, endOffset: 1070 },
							startOffset: 459,
							endOffset: 1070,
						},
						clientId: "a062b3dd-26d5-4d33-b59f-9746d13d1ee1",
					},
					{ name: "#text", value: "\n", sourceCodeRange: { startOffset: 1070, endOffset: 1071 } },
				],
			}
		);
	} );
} );
