import tokenize from "../../../../src/parse/build/private/tokenize";
import Paper from "../../../../src/values/Paper";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import { buildTreeNoTokenize } from "../../../specHelpers/parse/buildTree";
import LanguageProcessor from "../../../../src/parse/language/LanguageProcessor";
import SourceCodeLocation from "../../../../src/parse/structure/SourceCodeLocation";

describe( "A test for the tokenize function",
	function() {
		it( "should correctly tokenize a paragraph of one sentence", function() {
			const mockPaper = new Paper( "<p>This is a paragraph</p>", { locale: "en_US" } );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const languageProcessor = new LanguageProcessor( mockResearcher );
			buildTreeNoTokenize( mockPaper );
			expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "This is a paragraph",
						sourceCodeRange: new SourceCodeLocation( { startOffset: 3, endOffset: 22 } ) } ],
					isImplicit: false,
					name: "p",
					sentences: [ {
						sourceCodeRange: { endOffset: 22, startOffset: 3 },
						text: "This is a paragraph",
						tokens: [ { sourceCodeRange: { endOffset: 7, startOffset: 3 }, text: "This" }, {
							sourceCodeRange: {
								endOffset: 8,
								startOffset: 7,
							}, text: " ",
						}, { sourceCodeRange: { endOffset: 10, startOffset: 8 }, text: "is" }, {
							sourceCodeRange: { endOffset: 11, startOffset: 10 },
							text: " ",
						}, { sourceCodeRange: { endOffset: 12, startOffset: 11 }, text: "a" }, {
							sourceCodeRange: { endOffset: 13, startOffset: 12 },
							text: " ",
						}, { sourceCodeRange: { endOffset: 22, startOffset: 13 }, text: "paragraph" } ],
					} ],
					sourceCodeLocation: {
						endOffset: 26,
						endTag: { endOffset: 26, startOffset: 22 },
						startOffset: 0,
						startTag: { endOffset: 3, startOffset: 0 },
					},
				} ],
				name: "#document-fragment",
			}
			);
		} );

		it( "should correctly tokenize a paragraph of two sentences", function() {
			const mockPaper = new Paper( "<p>This is a sentence. This is another sentence.</p>", { locale: "en_US" } );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const languageProcessor = new LanguageProcessor( mockResearcher );
			buildTreeNoTokenize( mockPaper );
			expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( {
				attributes: {},
				childNodes: [
					{
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "This is a sentence. This is another sentence.",
								sourceCodeRange: new SourceCodeLocation( { startOffset: 3, endOffset: 48 } ),
							},
						],
						isImplicit: false,
						name: "p",
						sentences: [
							{
								sourceCodeRange: {
									endOffset: 22,
									startOffset: 3,
								},
								text: "This is a sentence.",
								tokens: [
									{
										sourceCodeRange: {
											endOffset: 7,
											startOffset: 3,
										},
										text: "This",
									},
									{
										sourceCodeRange: {
											endOffset: 8,
											startOffset: 7,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 10,
											startOffset: 8,
										},
										text: "is",
									},
									{
										sourceCodeRange: {
											endOffset: 11,
											startOffset: 10,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 12,
											startOffset: 11,
										},
										text: "a",
									},
									{
										sourceCodeRange: {
											endOffset: 13,
											startOffset: 12,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 21,
											startOffset: 13,
										},
										text: "sentence",
									},
									{
										sourceCodeRange: {
											endOffset: 22,
											startOffset: 21,
										},
										text: ".",
									},
								],
							},
							{
								sourceCodeRange: {
									endOffset: 48,
									startOffset: 22,
								},
								text: " This is another sentence.",
								tokens: [
									{
										sourceCodeRange: {
											endOffset: 23,
											startOffset: 22,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 27,
											startOffset: 23,
										},
										text: "This",
									},
									{
										sourceCodeRange: {
											endOffset: 28,
											startOffset: 27,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 30,
											startOffset: 28,
										},
										text: "is",
									},
									{
										sourceCodeRange: {
											endOffset: 31,
											startOffset: 30,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 38,
											startOffset: 31,
										},
										text: "another",
									},
									{
										sourceCodeRange: {
											endOffset: 39,
											startOffset: 38,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											endOffset: 47,
											startOffset: 39,
										},
										text: "sentence",
									},
									{
										sourceCodeRange: {
											endOffset: 48,
											startOffset: 47,
										},
										text: ".",
									},
								],
							},
						],
						sourceCodeLocation: {
							endOffset: 52,
							endTag: {
								endOffset: 52,
								startOffset: 48,
							},
							startOffset: 0,
							startTag: {
								endOffset: 3,
								startOffset: 0,
							},
						},
					},
				],
				name: "#document-fragment",
			} );
		} );

		it( "should correctly tokenize a sentence with a number with a decimal point", function() {
			const mockPaper = new Paper( "<p>This is the release of YoastSEO 9.3.</p>", { keyword: "YoastSEO 9.3" } );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const languageProcessor = new LanguageProcessor( mockResearcher );
			buildTreeNoTokenize( mockPaper );
			const result = tokenize( mockPaper.getTree(), languageProcessor );
			expect( result ).toEqual( {
				name: "#document-fragment",
				attributes: {},
				childNodes: [
					{
						name: "p",
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "This is the release of YoastSEO 9.3.",
								sourceCodeRange: new SourceCodeLocation( { startOffset: 3, endOffset: 39 } ),
							},
						],
						sourceCodeLocation: {
							startTag: {
								startOffset: 0,
								endOffset: 3,
							},
							endTag: {
								startOffset: 39,
								endOffset: 43,
							},
							startOffset: 0,
							endOffset: 43,
						},
						isImplicit: false,
						sentences: [
							{
								text: "This is the release of YoastSEO 9.3.",
								tokens: [
									{
										text: "This",
										sourceCodeRange: {
											startOffset: 3,
											endOffset: 7,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 7,
											endOffset: 8,
										},
									},
									{
										text: "is",
										sourceCodeRange: {
											startOffset: 8,
											endOffset: 10,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 10,
											endOffset: 11,
										},
									},
									{
										text: "the",
										sourceCodeRange: {
											startOffset: 11,
											endOffset: 14,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 14,
											endOffset: 15,
										},
									},
									{
										text: "release",
										sourceCodeRange: {
											startOffset: 15,
											endOffset: 22,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 22,
											endOffset: 23,
										},
									},
									{
										text: "of",
										sourceCodeRange: {
											startOffset: 23,
											endOffset: 25,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 25,
											endOffset: 26,
										},
									},
									{
										text: "YoastSEO",
										sourceCodeRange: {
											startOffset: 26,
											endOffset: 34,
										},
									},
									{
										text: " ",
										sourceCodeRange: {
											startOffset: 34,
											endOffset: 35,
										},
									},
									{
										text: "9.3",
										sourceCodeRange: {
											startOffset: 35,
											endOffset: 38,
										},
									},
									{
										text: ".",
										sourceCodeRange: {
											startOffset: 38,
											endOffset: 39,
										},
									},
								],
								sourceCodeRange: {
									startOffset: 3,
									endOffset: 39,
								},
							},
						],
					},
				],
			} );
		} );

		it( "should correctly tokenize a sentence containing an HTML entity", function() {
			// This tests the scenario where an ampersand character "&" enters the Paper as "&amp;" in Classic editor.
			// "&amp;" is first transformed to "#amp;" and then turned back to "&" during tokenization.
			// The length of "&" should be 5 characters (like "&amp;"), instead of 1.
			const mockPaper = new Paper( "<p>This is a paragraph&amp;</p>" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const languageProcessor = new LanguageProcessor( mockResearcher );
			buildTreeNoTokenize( mockPaper );
			const result = tokenize( mockPaper.getTree(), languageProcessor );
			expect( result ).toEqual( {
				attributes: {},
				childNodes: [
					{
						attributes: {},
						childNodes: [
							{
								name: "#text",
								sourceCodeRange: {
									startOffset: 3,
									endOffset: 27,
								},
								value: "This is a paragraph#amp;",
							},
						],
						isImplicit: false,
						name: "p",
						sentences: [
							{
								sourceCodeRange: {
									startOffset: 3,
									endOffset: 27,
								},
								text: "This is a paragraph&",
								tokens: [
									{
										sourceCodeRange: {
											startOffset: 3,
											endOffset: 7,
										},
										text: "This",
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
											endOffset: 10,
										},
										text: "is",
									},
									{
										sourceCodeRange: {
											startOffset: 10,
											endOffset: 11,
										},
										text: " ",
									},
									{
										sourceCodeRange: {
											startOffset: 11,
											endOffset: 12,
										},
										text: "a",
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
											endOffset: 27,
										},
										text: "paragraph&",
									},
								],
							},
						],
						sourceCodeLocation: {
							startOffset: 0,
							endOffset: 31,
							startTag: {
								startOffset: 0,
								endOffset: 3,
							},
							endTag: {
								startOffset: 27,
								endOffset: 31,
							},
						},
					},
				],
				name: "#document-fragment",
			} );
		} );

		it( "should correctly tokenize a paragraph with single br tags", function() {
			const mockPaper = new Paper( "<p>This is a sentence.<br />This is<br>another sentence.</p>" );
			const mockResearcher = new EnglishResearcher( mockPaper );
			const languageProcessor = new LanguageProcessor( mockResearcher );
			buildTreeNoTokenize( mockPaper );
			const result = tokenize( mockPaper.getTree(), languageProcessor );
			const sentences = result.childNodes[ 0 ].sentences;
			expect( sentences.length ).toEqual( 2 );
			const firstSentence = sentences[ 0 ];
			expect( firstSentence.text ).toEqual( "This is a sentence." );
			expect( firstSentence.sourceCodeRange ).toEqual( { startOffset: 3, endOffset: 22 } );
			expect( firstSentence.tokens.length ).toEqual( 8 );
			const secondSentence = sentences[ 1 ];
			expect( secondSentence.text ).toEqual( "\nThis is\nanother sentence." );
			expect( secondSentence.sourceCodeRange ).toEqual( { startOffset: 27, endOffset: 56 } );
			expect( secondSentence.tokens.length ).toEqual( 9 );
			const [ br1, this1, , is1, br2, another1, , , ] = secondSentence.tokens;
			expect( br1.sourceCodeRange ).toEqual( { startOffset: 27, endOffset: 28 } );
			expect( this1.sourceCodeRange ).toEqual( { startOffset: 28, endOffset: 32 } );
			expect( is1.sourceCodeRange ).toEqual( { startOffset: 33, endOffset: 35 } );
			expect( br2.sourceCodeRange ).toEqual( { startOffset: 38, endOffset: 39 } );
			expect( another1.sourceCodeRange ).toEqual( { startOffset: 39, endOffset: 46 } );
		} );
	} );

describe( "A test for tokenizing a Japanese sentence", function() {
	it( "should correctly tokenize a simple Japanese sentence.", function() {
		const mockPaper = new Paper( "<p>犬が大好き\u3002</p>", { locale: "ja_JP" } );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		const languageProcessor = new LanguageProcessor( mockResearcher );
		buildTreeNoTokenize( mockPaper );
		expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( {
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "犬が大好き。",
							sourceCodeRange: new SourceCodeLocation( { startOffset: 3, endOffset: 9 } ),
						},
					],
					isImplicit: false,
					name: "p",
					sentences: [
						{
							sourceCodeRange: {
								startOffset: 3,
								endOffset: 9,
							},
							text: "犬が大好き。",
							tokens: [
								{
									sourceCodeRange: {
										startOffset: 3,
										endOffset: 4,
									},
									text: "犬",
								},
								{
									sourceCodeRange: {
										startOffset: 4,
										endOffset: 5,
									},
									text: "が",
								},
								{
									sourceCodeRange: {
										startOffset: 5,
										endOffset: 8,
									},
									text: "大好き",
								},
								{
									sourceCodeRange: {
										startOffset: 8,
										endOffset: 9,
									},
									text: "。",
								},
							],
						},
					],
					sourceCodeLocation: {
						startOffset: 0,
						endOffset: 13,
						startTag: {
							startOffset: 0,
							endOffset: 3,
						},
						endTag: {
							startOffset: 9,
							endOffset: 13,
						},
					},
				},
			],
			name: "#document-fragment",
		} );
	} );
} );
