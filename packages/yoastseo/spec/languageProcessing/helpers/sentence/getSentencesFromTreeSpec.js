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
			},
			{
				sourceCodeRange: { endOffset: 64, startOffset: 44 },
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
				] },
			{
				sourceCodeRange: { endOffset: 86, startOffset: 72 },
				text: "A subheading 3",
				tokens: [
					{ sourceCodeRange: { endOffset: 73, startOffset: 72 }, text: "A" },
					{ sourceCodeRange: { endOffset: 74, startOffset: 73 }, text: " " },
					{ sourceCodeRange: { endOffset: 84, startOffset: 74 }, text: "subheading" },
					{ sourceCodeRange: { endOffset: 85, startOffset: 84 }, text: " " },
					{ sourceCodeRange: { endOffset: 86, startOffset: 85 }, text: "3" },
				] },
			{
				sourceCodeRange: {},
				text: "text text text",
				tokens: [
					{ sourceCodeRange: {}, text: "text" },
					{ sourceCodeRange: {}, text: " " },
					{ sourceCodeRange: {}, text: "text" },
					{ sourceCodeRange: {}, text: " " },
					{ sourceCodeRange: {}, text: "text" },
				] },
			{
				sourceCodeRange: { endOffset: 123, startOffset: 109 },
				text: "A subheading 4",
				tokens: [
					{ sourceCodeRange: { endOffset: 110, startOffset: 109 }, text: "A" },
					{ sourceCodeRange: { endOffset: 111, startOffset: 110 }, text: " " },
					{ sourceCodeRange: { endOffset: 121, startOffset: 111 }, text: "subheading" },
					{ sourceCodeRange: { endOffset: 122, startOffset: 121 }, text: " " },
					{ sourceCodeRange: { endOffset: 123, startOffset: 122 }, text: "4" },
				] },
			{
				sourceCodeRange: { endOffset: 138, startOffset: 128 },
				text: "more text.",
				tokens: [
					{ sourceCodeRange: { endOffset: 132, startOffset: 128 }, text: "more" },
					{ sourceCodeRange: { endOffset: 133, startOffset: 132 }, text: " " },
					{ sourceCodeRange: { endOffset: 137, startOffset: 133 }, text: "text" },
					{ sourceCodeRange: { endOffset: 138, startOffset: 137 }, text: "." },
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
			},
		] );
	} );
} );
