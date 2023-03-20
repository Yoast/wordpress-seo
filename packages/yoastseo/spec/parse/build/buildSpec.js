import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";

describe( "The parse function", () => {
	it( "parses a basic HTML text", () => {
		const html = "<div><p class='yoast'>Hello, world!</p></div>";

		const researcher = Factory.buildMockResearcher( {} );
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
						"class": "yoast",
					},
					sentences: [],
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

		const researcher = Factory.buildMockResearcher( {} );
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
					sentences: [],
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

		const researcher = Factory.buildMockResearcher( {} );
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
							sentences: [],
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
							sentences: [],
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

		const researcher = Factory.buildMockResearcher( {} );
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
							sentences: [],
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
							sentences: [],
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
							sentences: [],
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
							sentences: [],
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
							sentences: [],
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
} );
