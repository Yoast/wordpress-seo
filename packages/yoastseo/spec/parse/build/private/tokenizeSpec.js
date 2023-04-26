import tokenize from "../../../../src/parse/build/private/tokenize";
import Paper from "../../../../src/values/Paper";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import { buildTreeNoTokenize } from "../../../specHelpers/parse/buildTree";
import LanguageProcessor from "../../../../src/parse/language/LanguageProcessor";

describe( "A test for the tokenize function", function() {
	it( "should correctly tokenize a paragraph of one sentence", function() {
		const mockPaper = new Paper( "<p>This is a paragraph</p>", { locale: "en_US" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const languageProcessor = new LanguageProcessor( mockResearcher );
		buildTreeNoTokenize( mockPaper );
		// eslint-disable-next-line max-len
		expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( { attributes: {}, childNodes: [ { attributes: {}, childNodes: [ { name: "#text", value: "This is a paragraph" } ], isImplicit: false, name: "p", sentences: [ { sourceCodeRange: { endOffset: 22, startOffset: 3 }, text: "This is a paragraph", tokens: [ { sourceCodeRange: { endOffset: 7, startOffset: 3 }, text: "This" }, { sourceCodeRange: { endOffset: 8, startOffset: 7 }, text: " " }, { sourceCodeRange: { endOffset: 10, startOffset: 8 }, text: "is" }, { sourceCodeRange: { endOffset: 11, startOffset: 10 }, text: " " }, { sourceCodeRange: { endOffset: 12, startOffset: 11 }, text: "a" }, { sourceCodeRange: { endOffset: 13, startOffset: 12 }, text: " " }, { sourceCodeRange: { endOffset: 22, startOffset: 13 }, text: "paragraph" } ] } ], sourceCodeLocation: { endOffset: 26, endTag: { endOffset: 26, startOffset: 22 }, startOffset: 0, startTag: { endOffset: 3, startOffset: 0 } } } ], name: "#document-fragment" }

		);
	} );

	it( "should correctly tokenize a paragraph of two sentences", function() {
		const mockPaper = new Paper( "<p>This is a sentence. This is another sentence.</p>", { locale: "en_US" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const languageProcessor = new LanguageProcessor( mockResearcher );
		buildTreeNoTokenize( mockPaper );
		// eslint-disable-next-line max-len
		expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( {
			attributes: {},
			childNodes: [
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "This is a sentence. This is another sentence.",
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

	it( "should correctly tokenize an image with a caption", () => {
		const mockPaper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"A flamboyant cat with a toy<br></br>\n" +
			"</p>",
		{ keyword: "cat toy" } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		const languageProcessor = new LanguageProcessor( mockResearcher );
		buildTreeNoTokenize( mockPaper );
		const x = tokenize( mockPaper.getTree(), languageProcessor );
		console.log(x);
		expect( tokenize( mockPaper.getTree(), languageProcessor ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "p",
					attributes: {},
					childNodes: [
						{
							name: "img",
							attributes: {
								"class": {},
								src: "http://basic.wordpress.test/wp-content/uploads/2021/08/cat-3957861_1280-211x300.jpeg",
								alt: "a different cat with toy",
								width: "211",
								height: "300",
							},
							childNodes: [],
							sourceCodeLocation: {
								startTag: {
									startOffset: 3,
									endOffset: 187,
								},
								startOffset: 3,
								endOffset: 187,
							},
						},
						{
							name: "#text",
							value: " A flamboyant cat with a toy",
						},
						{
							name: "br",
							attributes: {},
							childNodes: [],
							sourceCodeLocation: {
								startTag: {
									startOffset: 221,
									endOffset: 225,
								},
								startOffset: 221,
								endOffset: 225,
							},
						},
						{
							name: "br",
							attributes: {},
							childNodes: [],
						},
						{
							name: "#text",
							value: "\n",
						},
					],
					sourceCodeLocation: {
						startTag: {
							startOffset: 0,
							endOffset: 3,
						},
						endTag: {
							startOffset: 232,
							endOffset: 236,
						},
						startOffset: 0,
						endOffset: 236,
					},
					isImplicit: false,
					sentences: [
						{
							text: " A flamboyant cat with a toy\n",
							tokens: [
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 193,
										endOffset: 194,
									},
								},
								{
									text: "A",
									sourceCodeRange: {
										startOffset: 194,
										endOffset: 195,
									},
								},
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 195,
										endOffset: 196,
									},
								},
								{
									text: "flamboyant",
									sourceCodeRange: {
										startOffset: 196,
										endOffset: 206,
									},
								},
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 206,
										endOffset: 207,
									},
								},
								{
									text: "cat",
									sourceCodeRange: {
										startOffset: 207,
										endOffset: 210,
									},
								},
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 210,
										endOffset: 211,
									},
								},
								{
									text: "with",
									sourceCodeRange: {
										startOffset: 211,
										endOffset: 215,
									},
								},
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 215,
										endOffset: 216,
									},
								},
								{
									text: "a",
									sourceCodeRange: {
										startOffset: 216,
										endOffset: 217,
									},
								},
								{
									text: " ",
									sourceCodeRange: {
										startOffset: 217,
										endOffset: 218,
									},
								},
								{
									text: "toy",
									sourceCodeRange: {
										startOffset: 218,
										endOffset: 221,
									},
								},
								{
									text: "\n",
									sourceCodeRange: {
										startOffset: 230,
										endOffset: 232,
									},
								},
							],
							sourceCodeRange: {
								startOffset: 193,
								endOffset: 232,
							},
						},
					],
				},
			],
		} );
	} );
} );
