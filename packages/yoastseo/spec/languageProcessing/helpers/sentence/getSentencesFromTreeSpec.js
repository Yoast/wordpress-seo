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
		expect( getSentencesFromTree( paper ) ).toEqual( [
			{
				sourceCodeRange: { endOffset: 44, startOffset: 3 },
				text: "A very intelligent cat loves their human.",
				tokens: [ { text: "A" }, { text: " " }, { text: "very" }, { text: " " }, { text: "intelligent" }, { text: " " }, { text: "cat" },
					{ text: " " }, { text: "loves" }, { text: " " }, { text: "their" }, { text: " " }, { text: "human" }, { text: "." } ] },
			{
				sourceCodeRange: { endOffset: 64, startOffset: 44 },
				text: " A dog is very cute.",
				tokens: [ { text: " " }, { text: "A" }, { text: " " }, { text: "dog" }, { text: " " }, { text: "is" }, { text: " " },
					{ text: "very" }, { text: " " }, { text: "cute" }, { text: "." } ] },
			{
				sourceCodeRange: { endOffset: 86, startOffset: 72 },
				text: "A subheading 3",
				tokens: [ { text: "A" }, { text: " " }, { text: "subheading" }, { text: " " }, { text: "3" } ] },
			{
				sourceCodeRange: {},
				text: "text text text",
				tokens: [ { text: "text" }, { text: " " }, { text: "text" }, { text: " " }, { text: "text" } ] },
			{
				sourceCodeRange: { endOffset: 123, startOffset: 109 },
				text: "A subheading 4",
				tokens: [ { text: "A" }, { text: " " }, { text: "subheading" }, { text: " " }, { text: "4" } ] },
			{
				sourceCodeRange: { endOffset: 138, startOffset: 128 },
				text: "more text.", tokens: [ { text: "more" }, { text: " " }, { text: "text" }, { text: "." } ] },
		]
		);
	} );
} );
