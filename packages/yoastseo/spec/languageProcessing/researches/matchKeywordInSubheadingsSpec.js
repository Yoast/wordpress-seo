import matchKeywordInSubheadings from "../../../src/languageProcessing/researches/matchKeywordInSubheadings";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";

describe( "Matching keyphrase in subheadings", () => {
	it( "matches only h2 and h3 subheadings", () => {
		const paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>",
			{},
		);
		const result = matchKeywordInSubheadings( paper, new Researcher( paper ) );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
	} );

	it( "matching is stricter with languages that do not support function words", () => {
		// There is no function word support for Afrikaans.
		const paper = new Paper( "<h2>So ’n groot hond</h2>", {
			keyword: "So ’n groot huis",
			locale: "af",
		} );

		// All the words should match and since hond !== huis the expected result is 0.
		expect( matchKeywordInSubheadings( paper, new DefaultResearcher( paper ) ).matches ).toBe( 0 );

		// There is function word support for English.
		paper._attributes.locale = "en_US";
		// More than 50% should match. With 1 of the 4 words mismatching the expected result is 1.
		expect( matchKeywordInSubheadings( paper, new Researcher( paper ) ).matches ).toBe( 1 );
	} );

	it( "tests for a case when there is no subheading in the text", () => {
		const paper = new Paper(
			"A beautiful tortie cat.",
			{},
		);
		const result = matchKeywordInSubheadings( paper, new Researcher( paper ) );
		expect( result.count ).toBe( 0 );
	} );
} );
