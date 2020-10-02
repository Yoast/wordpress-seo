import matchKeywordInSubheadings from "../../src/languages/legacy/researches/matchKeywordInSubheadings";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory";

describe( "Matching keyphrase in subheadings", () => {
	it( "matches only h2 and h3 subheadings", () => {
		const paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>",
			{},
		);
		const researcher = Factory.buildMockResearcher( {
			keyphraseForms: [],
			synonymsForms: [],
		} );
		const result = matchKeywordInSubheadings( paper, researcher );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
	} );

	it( "matching is stricter with languages that do not support function words", () => {
		// There is no function word support for Afrikaans.
		const paper = new Paper( "<h2>So ’n groot hond</h2>", {
			keyword: "So ’n groot huis",
			locale: "af",
		} );
		const researcher = Factory.buildMockResearcher( {
			keyphraseForms: [ [ "So" ], [ "’n" ], [ "groot" ], [ "huis" ], [ "hond" ] ],
			synonymsForms: [],
		} );

		// All the words should match and since hond !== huis the expected result is 0.
		expect( matchKeywordInSubheadings( paper, researcher ).matches ).toBe( 0 );

		// There is function word support for English.
		paper._attributes.locale = "en_US";
		// More than 50% should match. With 1 of the 4 words mismatching the expected result is 1.
		expect( matchKeywordInSubheadings( paper, researcher ).matches ).toBe( 1 );
	} );
} );
