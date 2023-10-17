import Paper from "../../../../src/values/Paper";
import getSentencesFromTree from "../../../../src/languageProcessing/helpers/sentence/getSentencesFromTree";
import buildTree from "../../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

describe( "test to get sentences from the tree", () => {
	let researcher;
	beforeEach( () => {
		const mockPaper = new Paper( "" );
		researcher = new EnglishResearcher( mockPaper );
	} );
	it( "returns the sentences from paragraph and heading nodes", () => {
		const paper = new Paper( "<div><p>A very intelligent cat loves their human. A dog is very cute.</p><h3>A subheading 3" +
			"</h3><h4>A subheading 4</h4></div>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{
				sourceCodeRange: { startOffset: 8, endOffset: 49 },
				parentStartOffset: 8,
				text: "A very intelligent cat loves their human.",
				tokens: [
					{ sourceCodeRange: { startOffset: 8, endOffset: 9 }, text: "A" },
					{ sourceCodeRange: { startOffset: 9, endOffset: 10 }, text: " " },
					{ sourceCodeRange: { startOffset: 10, endOffset: 14 }, text: "very" },
					{ sourceCodeRange: { startOffset: 14, endOffset: 15 }, text: " " },
					{ sourceCodeRange: { startOffset: 15, endOffset: 26 }, text: "intelligent" },
					{ sourceCodeRange: { startOffset: 26, endOffset: 27 }, text: " " },
					{ sourceCodeRange: { startOffset: 27, endOffset: 30 }, text: "cat" },
					{ sourceCodeRange: { startOffset: 30, endOffset: 31 }, text: " " },
					{ sourceCodeRange: { startOffset: 31, endOffset: 36 }, text: "loves" },
					{ sourceCodeRange: { startOffset: 36, endOffset: 37 }, text: " " },
					{ sourceCodeRange: { startOffset: 37, endOffset: 42 }, text: "their" },
					{ sourceCodeRange: { startOffset: 42, endOffset: 43 }, text: " " },
					{ sourceCodeRange: { startOffset: 43, endOffset: 48 }, text: "human" },
					{ sourceCodeRange: { startOffset: 48, endOffset: 49 }, text: "." },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { endOffset: 69, startOffset: 49 },
				parentStartOffset: 8,
				text: " A dog is very cute.",
				tokens: [
					{ sourceCodeRange: { startOffset: 49, endOffset: 50 }, text: " " },
					{ sourceCodeRange: { startOffset: 50, endOffset: 51 }, text: "A" },
					{ sourceCodeRange: { startOffset: 51, endOffset: 52 }, text: " " },
					{ sourceCodeRange: { startOffset: 52, endOffset: 55 }, text: "dog" },
					{ sourceCodeRange: { startOffset: 55, endOffset: 56 }, text: " " },
					{ sourceCodeRange: { startOffset: 56, endOffset: 58 }, text: "is" },
					{ sourceCodeRange: { startOffset: 58, endOffset: 59 }, text: " " },
					{ sourceCodeRange: { startOffset: 59, endOffset: 63 }, text: "very" },
					{ sourceCodeRange: { startOffset: 63, endOffset: 64 }, text: " " },
					{ sourceCodeRange: { startOffset: 64, endOffset: 68 }, text: "cute" },
					{ sourceCodeRange: { startOffset: 68, endOffset: 69 }, text: "." },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { startOffset: 77, endOffset: 91 },
				parentStartOffset: 77,
				text: "A subheading 3",
				tokens: [
					{ sourceCodeRange: { startOffset: 77, endOffset: 78 }, text: "A" },
					{ sourceCodeRange: { startOffset: 78, endOffset: 79 }, text: " " },
					{ sourceCodeRange: { startOffset: 79, endOffset: 89 }, text: "subheading" },
					{ sourceCodeRange: { startOffset: 89, endOffset: 90 }, text: " " },
					{ sourceCodeRange: { startOffset: 90, endOffset: 91 }, text: "3" },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { startOffset: 100, endOffset: 114 },
				parentStartOffset: 100,
				text: "A subheading 4",
				tokens: [
					{ sourceCodeRange: { startOffset: 100, endOffset: 101 }, text: "A" },
					{ sourceCodeRange: { startOffset: 101, endOffset: 102 }, text: " " },
					{ sourceCodeRange: { startOffset: 102, endOffset: 112 }, text: "subheading" },
					{ sourceCodeRange: { startOffset: 112, endOffset: 113 }, text: " " },
					{ sourceCodeRange: { startOffset: 113, endOffset: 114 }, text: "4" },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
		] );
	} );
	it( "returns the sentences from an implicit paragraph (an image caption)", () => {
		const paper = new Paper( "[caption id=\"attachment_75\" align=\"alignnone\" width=\"200\"]<img class=\"wp-image-75 size-medium\"" +
			" src=\"https://basic.wordpress.test/wp-content/uploads/2023/05/African_Bush_Elephant-200x300.jpg\" alt=\"elephant\"" +
			" width=\"200\" height=\"300\" /> elephant[/caption]", { shortcodes: [ "caption" ] } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
				parentStartOffset: 0,
				sourceCodeRange: {
					endOffset: 252,
					startOffset: 0,
				},
				text: " elephant",
				tokens: [
					{
						sourceCodeRange: {
							endOffset: 234,
							startOffset: 233,
						},
						text: " ",
					},
					{
						sourceCodeRange: {
							endOffset: 242,
							startOffset: 234,
						},
						text: "elephant",
					},
					{
						sourceCodeRange: {
							endOffset: 243,
							startOffset: 242,
						},
						text: "[",
					},
					{
						sourceCodeRange: {
							endOffset: 251,
							startOffset: 243,
						},
						text: "/caption",
					},
					{
						sourceCodeRange: {
							endOffset: 252,
							startOffset: 251,
						},
						text: "]",
					},
				],
			},
		] );
	} );
	it( "should not include sentences from non-paragraph and non-heading nodes", () => {
		const paper = new Paper( "<p>A cute red panda</p><blockquote>The red panda (Ailurus fulgens), also known as the lesser panda," +
			" is a small mammal native to the eastern Himalayas and southwestern China</blockquote>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{ sourceCodeRange: { startOffset: 3, endOffset: 19 },
				text: "A cute red panda",
				tokens: [
					{ sourceCodeRange: { startOffset: 3, endOffset: 4 }, text: "A" },
					{ sourceCodeRange: { startOffset: 4, endOffset: 5 }, text: " " },
					{ sourceCodeRange: { startOffset: 5, endOffset: 9 }, text: "cute" },
					{ sourceCodeRange: { startOffset: 9, endOffset: 10 }, text: " " },
					{ sourceCodeRange: { startOffset: 10, endOffset: 13 }, text: "red" },
					{ sourceCodeRange: { startOffset: 13, endOffset: 14 }, text: " " },
					{ sourceCodeRange: { startOffset: 14, endOffset: 19 }, text: "panda" },
				],
				parentStartOffset: 3,
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
		] );
	} );
	it( "returns the sentences retrieved from Yoast block", () => {
		const paper = new Paper( "<div class=\"schema-faq wp-block-yoast-faq-block\"><div class=\"schema-faq-section\"" +
			" id=\"faq-question-1689322642789\"><strong class=\"schema-faq-question\">What is giant panda</strong> " +
			"<p class=\"schema-faq-answer\">Giant <strong>panda</strong> is test testts</p> </div> <div class=\"schema-faq-section\"" +
			" id=\"faq-question-1689322667728\"><strong class=\"schema-faq-question\">Test</strong> " +
			"<p class=\"schema-faq-answer\">Tets</p> </div> <div class=\"schema-faq-section\" id=\"faq-question-1689936392675\">" +
			"<strong class=\"schema-faq-question\">giant panda is silly</strong> <p class=\"schema-faq-answer\">" +
			"is this giant panda</p> </div> </div>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual(
			[
				{
					text: "What is giant panda",
					tokens: [
						{ text: "What", sourceCodeRange: { startOffset: 149, endOffset: 153 } },
						{ text: " ", sourceCodeRange: { startOffset: 153, endOffset: 154 } },
						{ text: "is", sourceCodeRange: { startOffset: 154, endOffset: 156 } },
						{ text: " ", sourceCodeRange: { startOffset: 156, endOffset: 157 } },
						{ text: "giant", sourceCodeRange: { startOffset: 157, endOffset: 162 } },
						{ text: " ", sourceCodeRange: { startOffset: 162, endOffset: 163 } },
						{ text: "panda", sourceCodeRange: { startOffset: 163, endOffset: 168 } },
					],
					sourceCodeRange: { startOffset: 149, endOffset: 168 },
					parentStartOffset: 113,
					parentClientId: "",
					parentAttributeId: "faq-question-1689322642789",
					isParentFirstSectionOfBlock: true,
				},
				{
					text: "Giant panda is test testts",
					tokens: [
						{ text: "Giant", sourceCodeRange: { startOffset: 207, endOffset: 212 } },
						{ text: " ", sourceCodeRange: { startOffset: 212, endOffset: 213 } },
						{ text: "panda", sourceCodeRange: { startOffset: 221, endOffset: 226 } },
						{ text: " ", sourceCodeRange: { startOffset: 235, endOffset: 236 } },
						{ text: "is", sourceCodeRange: { startOffset: 236, endOffset: 238 } },
						{ text: " ", sourceCodeRange: { startOffset: 238, endOffset: 239 } },
						{ text: "test", sourceCodeRange: { startOffset: 239, endOffset: 243 } },
						{ text: " ", sourceCodeRange: { startOffset: 243, endOffset: 244 } },
						{ text: "testts", sourceCodeRange: { startOffset: 244, endOffset: 250 } },
					],
					sourceCodeRange: { startOffset: 207, endOffset: 250 },
					parentStartOffset: 207,
					parentClientId: "",
					parentAttributeId: "faq-question-1689322642789",
					isParentFirstSectionOfBlock: false,
				},
				{
					text: "Test",
					tokens: [
						{ text: "Test", sourceCodeRange: { startOffset: 362, endOffset: 366 } },
					],
					sourceCodeRange: { startOffset: 362, endOffset: 366 },
					parentStartOffset: 326,
					parentClientId: "",
					parentAttributeId: "faq-question-1689322667728",
					isParentFirstSectionOfBlock: true,
				},
				{
					text: "Tets",
					tokens: [
						{ text: "Tets", sourceCodeRange: { startOffset: 405, endOffset: 409 } },
					],
					sourceCodeRange: { startOffset: 405, endOffset: 409 },
					parentStartOffset: 405,
					parentClientId: "",
					parentAttributeId: "faq-question-1689322667728",
					isParentFirstSectionOfBlock: false,
				},
				{
					text: "giant panda is silly",
					tokens: [
						{ text: "giant", sourceCodeRange: { startOffset: 521, endOffset: 526 } },
						{ text: " ", sourceCodeRange: { startOffset: 526, endOffset: 527 } },
						{ text: "panda", sourceCodeRange: { startOffset: 527, endOffset: 532 } },
						{ text: " ", sourceCodeRange: { startOffset: 532, endOffset: 533 } },
						{ text: "is", sourceCodeRange: { startOffset: 533, endOffset: 535 } },
						{ text: " ", sourceCodeRange: { startOffset: 535, endOffset: 536 } },
						{ text: "silly", sourceCodeRange: { startOffset: 536, endOffset: 541 } },
					],
					sourceCodeRange: { startOffset: 521, endOffset: 541 },
					parentStartOffset: 485,
					parentClientId: "",
					parentAttributeId: "faq-question-1689936392675",
					isParentFirstSectionOfBlock: true,
				},
				{
					text: "is this giant panda",
					tokens: [
						{ text: "is", sourceCodeRange: { startOffset: 580, endOffset: 582 } },
						{ text: " ", sourceCodeRange: { startOffset: 582, endOffset: 583 } },
						{ text: "this", sourceCodeRange: { startOffset: 583, endOffset: 587 } },
						{ text: " ", sourceCodeRange: { startOffset: 587, endOffset: 588 } },
						{ text: "giant", sourceCodeRange: { startOffset: 588, endOffset: 593 } },
						{ text: " ", sourceCodeRange: { startOffset: 593, endOffset: 594 } },
						{ text: "panda", sourceCodeRange: { startOffset: 594, endOffset: 599 } },
					],
					sourceCodeRange: { startOffset: 580, endOffset: 599 },
					parentStartOffset: 580,
					parentClientId: "",
					parentAttributeId: "faq-question-1689936392675",
					isParentFirstSectionOfBlock: false,
				},
			]
		);
	} );
	it( "should return empty array if no sentences are found in paragraph/heading node", () => {
		const paper = new Paper( "<p></p><blockquote>The red panda (Ailurus fulgens), also known as the lesser panda," +
			" is a small mammal native to the eastern Himalayas and southwestern China</blockquote>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [] );
	} );
} );
