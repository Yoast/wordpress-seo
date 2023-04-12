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
						sourceCodeRange: { startOffset: 5, endOffset: 30 },
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 5, endOffset: 10 } },
							{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
							{ text: "World", sourceCodeRange: { startOffset: 11, endOffset: 22 } },
							{ text: "!", sourceCodeRange: { startOffset: 22, endOffset: 30 } },
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
									{ text: "long", sourceCodeRange: { startOffset: 8, endOffset: 21 } },
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
									{ text: "fish", sourceCodeRange: { startOffset: 60, endOffset: 81 } },
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
	it( "parses a basic HTML text and filters out elements that should be filtered out", () => {
		const html = "<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>Hey, this is a table of contents.</div>" +
			"<div><p class='yoast'>Hello, world!<script>console.log(\"Hello, world!\")</script></p></div>";

		const researcher = Factory.buildMockResearcher( {}, true, false, false,
			{ memoizedTokenizer: memoizedSentenceTokenizer } );
		const languageProcessor = new LanguageProcessor( researcher );

		expect( build( html, languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				sourceCodeLocation: {
					startOffset: 113,
					endOffset: 203,
					startTag: {
						startOffset: 113,
						endOffset: 118,
					},
					endTag: {
						startOffset: 197,
						endOffset: 203,
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
						tokens: [
							{ text: "Hello", sourceCodeRange: { startOffset: 135, endOffset: 140 } },
							{ text: ",", sourceCodeRange: { startOffset: 140, endOffset: 141 } },
							{ text: " ", sourceCodeRange: { startOffset: 141, endOffset: 142 } },
							{ text: "world", sourceCodeRange: { startOffset: 142, endOffset: 147 } },
							{ text: "!", sourceCodeRange: { startOffset: 147, endOffset: 148 } },
						],
						sourceCodeRange: { startOffset: 135, endOffset: 148 },
					} ],
					childNodes: [ {
						name: "#text",
						value: "Hello, world!",
					} ],
					sourceCodeLocation: {
						startOffset: 118,
						endOffset: 197,
						startTag: {
							startOffset: 118,
							endOffset: 135,
						},
						endTag: {
							startOffset: 193,
							endOffset: 197,
						},
					},
				} ],
			} ],
		} );
	} );
} );
