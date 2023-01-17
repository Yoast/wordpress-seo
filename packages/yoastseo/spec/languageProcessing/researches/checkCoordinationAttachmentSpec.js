import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkCoordination from "../../../src/languageProcessing/researches/checkCoordination";

describe( "Check for syntactically ambiguous sentences with coordination", function() {
	it( "should find that some sentences are ambiguous because the adjective can attach to two nouns", function() {
		const mockPaper = new Paper(
			"Mary bought fresh bananas and apples. " +
			"Mary bought bananas. " +
			"Mary bought real estate and cars. "
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkCoordination( mockPaper, mockResearcher ) ).toEqual(
			[ {
				sentence: "Mary bought fresh bananas and apples.",
				reading1: "fresh bananas",
				reading2: "fresh apples",
				construction: [ "fresh", "bananas", "and", "apples" ],
			},
			{
				sentence: "Mary bought real estate and cars.",
				reading1: "real estate",
				reading2: "real cars",
				construction: [ "real", "estate", "and", "cars" ],
			},
			]

		);
	} );

	it( "should find that some sentences are ambiguous because of the compound form", function() {
		const mockPaper = new Paper(
			"I bought cheese and tomato sandwiches for lunch. " +
			"I bought cheese sandwiches. " +
			"Sarah bought butter and ham sandwiches for dinner. "
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkCoordination( mockPaper, mockResearcher ) ).toEqual(
			[ {
				sentence: "I bought cheese and tomato sandwiches for lunch.",
				reading1: "cheese sandwiches",
				reading2: "tomato sandwiches",
				construction: [ "cheese", "and", "tomato", "sandwiches" ],
			},
			{
				sentence: "Sarah bought butter and ham sandwiches for dinner.",
				reading1: "butter sandwiches",
				reading2: "ham sandwiches",
				construction: [ "butter", "and", "ham", "sandwiches" ],
			},
			] );
	} );
} );
