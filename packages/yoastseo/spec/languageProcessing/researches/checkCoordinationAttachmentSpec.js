import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkCoordination from "../../../src/languageProcessing/researches/checkCoordination";

describe( "Check for syntactically ambiguous sentences with coordination", function() {
	it( "should find that some sentences are ambiguous because the adjective can attach to two nouns", function() {
		const mockPaper = new Paper(
			"Mary bought fresh bananas and apples. " +
			"John saw the cop."
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkCoordination( mockPaper, mockResearcher ) ).toEqual(
			[ "Mary bought fresh bananas and apples." ] );
	} );

	it( "should find that some sentences are ambiguous because of the compound form", function() {
		const mockPaper = new Paper(
			"I bought cheese and tomato sandwiches for lunch. " +
			"John saw the cop."
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkCoordination( mockPaper, mockResearcher ) ).toEqual(
			[ "I bought cheese and tomato sandwiches for lunch." ] );
	} );
} );
