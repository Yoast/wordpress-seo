import Paper from "../../../../src/values/Paper";
import getSentencesFromTree from "../../../../src/languageProcessing/helpers/sentence/getSentencesFromTree";
import buildTree from "../../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

describe( "test to get sentences from the tree", () => {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
	} );
	it( "returns the sentences from paragraph and heading nodes", () => {
		const paper = new Paper( "<p>A very intelligent cat loves their human. A dog is very cute.</p><h3>A subheading 3" +
			"</h3>text text text<h4>A subheading 4</h4>more text." );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{
				sourceCodeRange: { endOffset: 44, startOffset: 3 },
				parentStartOffset: 3,
				text: "A very intelligent cat loves their human.",
				tokens: [
					{ sourceCodeRange: { endOffset: 4, startOffset: 3 }, text: "A" },
					{ sourceCodeRange: { endOffset: 5, startOffset: 4 }, text: " " },
					{ sourceCodeRange: { endOffset: 9, startOffset: 5 }, text: "very" },
					{ sourceCodeRange: { endOffset: 10, startOffset: 9 }, text: " " },
					{ sourceCodeRange: { endOffset: 21, startOffset: 10 }, text: "intelligent" },
					{ sourceCodeRange: { endOffset: 22, startOffset: 21 }, text: " " },
					{ sourceCodeRange: { endOffset: 25, startOffset: 22 }, text: "cat" },
					{ sourceCodeRange: { endOffset: 26, startOffset: 25 }, text: " " },
					{ sourceCodeRange: { endOffset: 31, startOffset: 26 }, text: "loves" },
					{ sourceCodeRange: { endOffset: 32, startOffset: 31 }, text: " " },
					{ sourceCodeRange: { endOffset: 37, startOffset: 32 }, text: "their" },
					{ sourceCodeRange: { endOffset: 38, startOffset: 37 }, text: " " },
					{ sourceCodeRange: { endOffset: 43, startOffset: 38 }, text: "human" },
					{ sourceCodeRange: { endOffset: 44, startOffset: 43 }, text: "." },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { endOffset: 64, startOffset: 44 },
				parentStartOffset: 3,
				text: " A dog is very cute.",
				tokens: [
					{ sourceCodeRange: { endOffset: 45, startOffset: 44 }, text: " " },
					{ sourceCodeRange: { endOffset: 46, startOffset: 45 }, text: "A" },
					{ sourceCodeRange: { endOffset: 47, startOffset: 46 }, text: " " },
					{ sourceCodeRange: { endOffset: 50, startOffset: 47 }, text: "dog" },
					{ sourceCodeRange: { endOffset: 51, startOffset: 50 }, text: " " },
					{ sourceCodeRange: { endOffset: 53, startOffset: 51 }, text: "is" },
					{ sourceCodeRange: { endOffset: 54, startOffset: 53 }, text: " " },
					{ sourceCodeRange: { endOffset: 58, startOffset: 54 }, text: "very" },
					{ sourceCodeRange: { endOffset: 59, startOffset: 58 }, text: " " },
					{ sourceCodeRange: { endOffset: 63, startOffset: 59 }, text: "cute" },
					{ sourceCodeRange: { endOffset: 64, startOffset: 63 }, text: "." },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { endOffset: 86, startOffset: 72 },
				parentStartOffset: 72,
				text: "A subheading 3",
				tokens: [
					{ sourceCodeRange: { endOffset: 73, startOffset: 72 }, text: "A" },
					{ sourceCodeRange: { endOffset: 74, startOffset: 73 }, text: " " },
					{ sourceCodeRange: { endOffset: 84, startOffset: 74 }, text: "subheading" },
					{ sourceCodeRange: { endOffset: 85, startOffset: 84 }, text: " " },
					{ sourceCodeRange: { endOffset: 86, startOffset: 85 }, text: "3" },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: {},
				parentStartOffset: 0,
				text: "text text text",
				tokens: [
					{ sourceCodeRange: {}, text: "text" },
					{ sourceCodeRange: {}, text: " " },
					{ sourceCodeRange: {}, text: "text" },
					{ sourceCodeRange: {}, text: " " },
					{ sourceCodeRange: {}, text: "text" },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { endOffset: 123, startOffset: 109 },
				parentStartOffset: 109,
				text: "A subheading 4",
				tokens: [
					{ sourceCodeRange: { endOffset: 110, startOffset: 109 }, text: "A" },
					{ sourceCodeRange: { endOffset: 111, startOffset: 110 }, text: " " },
					{ sourceCodeRange: { endOffset: 121, startOffset: 111 }, text: "subheading" },
					{ sourceCodeRange: { endOffset: 122, startOffset: 121 }, text: " " },
					{ sourceCodeRange: { endOffset: 123, startOffset: 122 }, text: "4" },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
			{
				sourceCodeRange: { endOffset: 138, startOffset: 128 },
				parentStartOffset: 128,
				text: "more text.",
				tokens: [
					{ sourceCodeRange: { endOffset: 132, startOffset: 128 }, text: "more" },
					{ sourceCodeRange: { endOffset: 133, startOffset: 132 }, text: " " },
					{ sourceCodeRange: { endOffset: 137, startOffset: 133 }, text: "text" },
					{ sourceCodeRange: { endOffset: 138, startOffset: 137 }, text: "." },
				],
				isParentFirstSectionOfBlock: false,
				parentAttributeId: "",
				parentClientId: "",
			},
		] );
	} );
	it( "should not include sentences from non-paragraph and non-heading nodes", () => {
		const paper = new Paper( "<p>A cute red panda</p><blockquote>The red panda (Ailurus fulgens), also known as the lesser panda," +
			" is a small mammal native to the eastern Himalayas and southwestern China</blockquote>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{ sourceCodeRange: { endOffset: 19, startOffset: 3 },
				text: "A cute red panda",
				tokens: [
					{ sourceCodeRange: { endOffset: 4, startOffset: 3 }, text: "A" },
					{ sourceCodeRange: { endOffset: 5, startOffset: 4 }, text: " " },
					{ sourceCodeRange: { endOffset: 9, startOffset: 5 }, text: "cute" },
					{ sourceCodeRange: { endOffset: 10, startOffset: 9 }, text: " " },
					{ sourceCodeRange: { endOffset: 13, startOffset: 10 }, text: "red" },
					{ sourceCodeRange: { endOffset: 14, startOffset: 13 }, text: " " },
					{ sourceCodeRange: { endOffset: 19, startOffset: 14 }, text: "panda" },
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
