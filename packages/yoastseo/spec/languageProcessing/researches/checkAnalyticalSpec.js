import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkAnalytical from "../../../src/languageProcessing/researches/checkAnalytical";

describe( "Check for sentences with analytical ambiguity", function() {
	it( "should find that some sentences are ambiguous", function() {
		const mockPaper = new Paper(
			"John is an English grammar teacher. " +
			"John is a teacher. "
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkAnalytical( mockPaper, mockResearcher ) ).toEqual(
			[
				{
					sentence: "John is an English grammar teacher.",
					reading1: "teacher of English grammar",
					reading2: "English teacher of grammar",
					construction: [ "English", "grammar", "teacher" ],
				},
			] );
	} );
} );
