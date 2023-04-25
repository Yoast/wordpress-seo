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
} );
