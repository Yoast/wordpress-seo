import Paper from "../../../../src/values/Paper";
import getSentencesFromTree from "../../../../src/languageProcessing/helpers/sentence/getSentencesFromTree";
import buildTree from "../../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

describe( "test", () => {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
	} );
	it( "test", () => {
		const paper = new Paper( "<p>A very intelligent cat loves their human. A dog is very cute.</p><h3>A subheading 3" +
			"</h3>text text text<h4>A subheading 4</h4>more text." );
		buildTree( paper, researcher );
		console.log(paper);
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
					{ sourceCodeRange: { endOffset: 4, startOffset: 3 }, text: " " },
					{ sourceCodeRange: { endOffset: 5, startOffset: 4 }, text: "A" },
					{ sourceCodeRange: { endOffset: 6, startOffset: 5 }, text: " " },
					{ sourceCodeRange: { endOffset: 9, startOffset: 6 }, text: "dog" },
					{ sourceCodeRange: { endOffset: 10, startOffset: 9 }, text: " " },
					{ sourceCodeRange: { endOffset: 12, startOffset: 10 }, text: "is" },
					{ sourceCodeRange: { endOffset: 13, startOffset: 12 }, text: " " },
					{ sourceCodeRange: { endOffset: 17, startOffset: 13 }, text: "very" },
					{ sourceCodeRange: { endOffset: 18, startOffset: 17 }, text: " " },
					{ sourceCodeRange: { endOffset: 22, startOffset: 18 }, text: "cute" },
					{ sourceCodeRange: { endOffset: 23, startOffset: 22 }, text: "." },
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
} );
