import { buildStems, collectStems, StemOriginalPair, TopicPhrase } from "../../src/researches/buildTopicStems.js";
import getMorphologyData from "../specHelpers/getMorphologyData";

const morphologyDataEN = getMorphologyData( "en" );
const morphologyDataDE = getMorphologyData( "de" );

describe( "A test for building stems for an array of words", function() {
	it( "returns an empty array if the input keyphrase is undefined", function() {
		let keyphrase;
		const forms = buildStems( keyphrase, "en", morphologyDataEN.en );
		expect( forms ).toEqual( { exactMatch: false, stemOriginalPairs: [] } );
	} );

	it( "returns the exact match if the input string is embedded in quotation marks (the language and morphAnalyzer do not matter)", function() {
		const keyphrase = "\"I am going for a walk\"";
		const forms = buildStems( keyphrase, "en", morphologyDataEN.en );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "I am going for a walk", keyphrase.substring( 1, keyphrase.length - 1 ) ) ],
				true
			)
		);
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet", function() {
		const forms = buildStems( "Je ne vais pas rire", "fr", false );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "rire", "rire" ) ],
				false )
		);
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet", function() {
		const forms = buildStems( "Como hacer guacamole como los mexicanos", "es", false );
		expect( forms ).toEqual(
			new TopicPhrase(
				[
					new StemOriginalPair( "guacamole", "guacamole" ),
					new StemOriginalPair( "mexicanos", "mexicanos" ),
				],
				false
			)
		);
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet and takes care of apostrophe variations", function() {
		expect( buildStems( "слово'слово", "ru", {} ) ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "слово'слово", "слово'слово" ) ], false )
		);

		expect( buildStems( "слово‘слово", "ru", {} ) ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "слово'слово", "слово‘слово" ) ], false )
		);

		expect( buildStems( "слово‛слово", "ru", {} ) ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "слово'слово", "слово‛слово" ) ], false )
		);

		expect( buildStems( "слово’слово", "ru", {} ) ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "слово'слово", "слово’слово" ) ], false )
		);

		expect( buildStems( "слово`слово", "ru", {} ) ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "слово'слово", "слово`слово" ) ], false )
		);
	} );

	it( "returns all content words for English if Free", function() {
		const forms = buildStems( "I am walking and singing in the rain", "en", false );
		expect( forms ).toEqual( new TopicPhrase(
			[
				new StemOriginalPair( "walking", "walking" ),
				new StemOriginalPair( "singing", "singing" ),
				new StemOriginalPair( "rain", "rain" ),
			],
			false
		) );
	} );

	it( "returns stems of all words for English if Premium if only function words are supplied", function() {
		const forms = buildStems( "One and two", "en", morphologyDataEN.en );
		expect( forms ).toEqual(
			new TopicPhrase(
				[
					new StemOriginalPair( "one", "One" ),
					new StemOriginalPair( "and", "and" ),
					new StemOriginalPair( "two", "two" ),
				],
				false
			)
		);
	} );

	it( "returns stems of all content words for English if Premium", function() {
		const forms = buildStems( "I am walking and singing in the rain", "en", morphologyDataEN.en );
		expect( forms ).toEqual(
			new TopicPhrase(
				[
					new StemOriginalPair( "walk", "walking" ),
					new StemOriginalPair( "sing", "singing" ),
					new StemOriginalPair( "rain", "rain" ),
				],
				false
			)
		);
	} );

	it( "returns stems of all content words for German if Premium", function() {
		const forms = buildStems( "Schnell und einfach Altbauwohnungen finden.", "de", morphologyDataDE.de );
		expect( forms ).toEqual(
			new TopicPhrase( [ new StemOriginalPair( "altbauwohnung", "Altbauwohnungen" ) ], false )
		);
	} );
} );

describe( "A test for building keyword and synonyms stems for a paper", function() {
	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for empty language", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		let language;

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "I am going for a walk", "I am going for a walk" ),
				],
				true
			),
			synonymsStems: [
				new TopicPhrase(
					[
						new StemOriginalPair( "You are not going for a walk", "You are not going for a walk" ),
					],
					true
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "movie", "movie" ),
					],
					false
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "work", "work" ),
						new StemOriginalPair( "diligent", "diligently" ),
					],
					false
				),
			],
		};

		expect( collectStems( keyword, synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for English", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "I am going for a walk", "I am going for a walk" ),
				],
				true
			),
			synonymsStems: [
				new TopicPhrase(
					[
						new StemOriginalPair( "You are not going for a walk", "You are not going for a walk" ),
					],
					true
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "movie", "movie" ),
					],
					false
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "work", "work" ),
						new StemOriginalPair( "diligent", "diligently" ),
					],
					false
				),
			],
		};

		expect( collectStems( keyword, synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for Dutch (no morphologyData available)", function() {
		const keyword = "Ik ga wandelen";
		// const synonyms = "\"Tu ne vas pas te promener\", Tu vas voir un film, Et lui il va travailler dur.";
		const synonyms = "";
		const language = "nl";

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "promener", "promener" ),
				],
				false
			),
			synonymsStems: [
			// 	new TopicPhrase(
			// 		[
			// 			new StemOriginalPair( "Tu ne vas pas te promener", "Tu ne vas pas te promener" ),
			// 		],
			// 		true
			// 	),
			// 	new TopicPhrase(
			// 		[
			// 			new StemOriginalPair( "voir", "voir" ),
			// 			new StemOriginalPair( "film", "film" ),
			// 		],
			// 		false
			// 	),
			// 	new TopicPhrase(
			// 		[
			// 			new StemOriginalPair( "travailler", "travailler" ),
			// 			new StemOriginalPair( "dur", "dur" ),
			// 		],
			// 		false
			// 	),
			],
		};
		expect( collectStems( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for an unexisting language (no morphology and function words)", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "yep";

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "I am going for a walk", "I am going for a walk" ),
				],
				true
			),
			synonymsStems: [
				new TopicPhrase(
					[
						new StemOriginalPair( "You are not going for a walk", "You are not going for a walk" ),
					],
					true
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "you", "You" ),
						new StemOriginalPair( "are", "are" ),
						new StemOriginalPair( "going", "going" ),
						new StemOriginalPair( "for", "for" ),
						new StemOriginalPair( "a", "a" ),
						new StemOriginalPair( "movie", "movie" ),
					],
					false
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "and", "And" ),
						new StemOriginalPair( "he", "he" ),
						new StemOriginalPair( "is", "is" ),
						new StemOriginalPair( "going", "going" ),
						new StemOriginalPair( "to", "to" ),
						new StemOriginalPair( "work", "work" ),
						new StemOriginalPair( "diligently", "diligently" ),
					],
					false
				),
			],
		};
		expect( collectStems( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const expectedResult = {
			keyphraseStems: { exactMatch: false, stemOriginalPairs: [] },
			synonymsStems: [],
		};
		expect( collectStems( "", "", "en_EN", morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no keyword was supplied ", function() {
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseStems: { exactMatch: false, stemOriginalPairs: [] },
			synonymsStems: [
				new TopicPhrase(
					[
						new StemOriginalPair( "You are not going for a walk", "You are not going for a walk" ),
					],
					true
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "movie", "movie" ),
					],
					false
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "work", "work" ),
						new StemOriginalPair( "diligent", "diligently" ),
					],
					false
				),
			],
		};
		expect( collectStems( "", synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no synonyms were supplied ", function() {
		const keyword = "\"I am going for a walk\"";
		const language = "en";

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "I am going for a walk", "I am going for a walk" ) ],
				true
			),
			synonymsStems: [],
		};
		expect( collectStems( keyword, "", language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );
} );

describe( "A test for topic phrase objects", function() {
	const testTopicPhrase = new TopicPhrase(
		[
			new StemOriginalPair( "movie", "movies" ),
			new StemOriginalPair( "work", "work" ),
		],
		false,
	);

	it( "constructs a topic phrase", () => {
		expect( testTopicPhrase ).toEqual(
			{
				exactMatch: false,
				stemOriginalPairs: [
					{ original: "movies", stem: "movie" },
					{ original: "work", stem: "work" },
				],
			} );
	} );

	it( "constructs an empty topic phrase", () => {
		const emptyTopicPhrase = new TopicPhrase();

		expect( emptyTopicPhrase ).toEqual(
			{
				exactMatch: false,
				stemOriginalPairs: [],
			} );
	} );

	it( "gets stems from a topic phrase", () => {
		expect( testTopicPhrase.getStems() ).toEqual( [ "movie", "work" ] );
	} );
} );

describe( "A test for stem original pair objects", function() {
	const testStemOriginalPair = new StemOriginalPair( "movie", "movies" );

	it( "constructs a topic phrase", () => {
		expect( testStemOriginalPair ).toEqual(
			{
				stem: "movie",
				original: "movies",
			} );
	} );
} );
