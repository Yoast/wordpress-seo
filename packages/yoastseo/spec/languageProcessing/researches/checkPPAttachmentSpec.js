import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkPPAttachment from "../../../src/languageProcessing/researches/checkPPAttachment";

describe( "Check for syntactically ambiguous sentences with PP attachment", function() {
	it( "should find that some sentences are ambiguous", function() {
		const mockPaper = new Paper(
			"John saw cops with large telescopes. " +
			"John saw the large cop with a big telescope riding a bike. " +
			"John saw the cop."
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkPPAttachment( mockPaper, mockResearcher ) ).toEqual(
			[
				{
					sentence: "John saw cops with large telescopes.",
					construction: ["saw", "cops", "with", "large", "telescopes"],
				},
				{
					sentence: "John saw the large cop with a big telescope riding a bike.",
					construction: ["saw", "the", "large", "cop", "with", "a", "big", "telescope"],
				},
			] );
	} );
} );
