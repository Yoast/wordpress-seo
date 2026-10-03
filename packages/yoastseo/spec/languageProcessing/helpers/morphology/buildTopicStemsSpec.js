import { buildStems, collectStems, StemOriginalPair, TopicPhrase } from "../../../../src/languageProcessing/helpers/morphology/buildTopicStems.js";
import baseStemmer from "../../../../src/languageProcessing/helpers/morphology/baseStemmer";

describe( "A test for building stems for an array of words", function() {
	it( "returns an empty array if the input keyphrase is undefined", function() {
		let keyphrase;
		const forms = buildStems( keyphrase, baseStemmer, [], true );
		expect( forms ).toEqual( new TopicPhrase( [], false )  );
	} );

	it( "returns the exact match if the input string is embedded in quotation marks (the language and morphAnalyzer do not matter)", function() {
		const keyphrase = "\"I am going for a walk\"";
		const forms = buildStems( keyphrase, baseStemmer, [], true );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "I am going for a walk", keyphrase.substring( 1, keyphrase.length - 1 ) ) ],
				true
			)
		);
	} );

	it( "returns all (content) words if there is function words and no language specific stemmer for this language yet ", function() {
		const functionWords = [ "kowe", "iki" ];
		const forms = buildStems( "kowe budal makaryo", baseStemmer, functionWords, true );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "budal", "budal" ), new StemOriginalPair( "makaryo", "makaryo" ) ],
				false )
		);
	} );

	it( "returns all (content) words if there is no language specific stemmer and no function words for this language yet", function() {
		const forms = buildStems( "kowe lungo", baseStemmer, [], true );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "kowe", "kowe" ), new StemOriginalPair( "lungo", "lungo" ) ],
				false )
		);
	} );
	it( "splits keyphrase on hyphen when hyphens should be considered word boundaries", function() {
		const forms = buildStems( "kowe-lungo", baseStemmer, [], true );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "kowe", "kowe" ), new StemOriginalPair( "lungo", "lungo" ) ],
				false )
		);
	} );
	it( "does not split keyphrase on hyphen when hyphens shouldn't be considered word boundaries", function() {
		const forms = buildStems( "kowe-lungo", baseStemmer, [], false );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "kowe-lungo", "kowe-lungo" ) ],
				false )
		);
	} );
	it( "returns all words if all words in keyphrase are function words", function() {
		const functionWords = [ "I", "am", "small" ];
		const forms = buildStems( "I am small", baseStemmer, functionWords, true );
		expect( forms ).toEqual(
			new TopicPhrase(
				[ new StemOriginalPair( "I", "I" ),
					new StemOriginalPair( "am", "am" ),
					new StemOriginalPair( "small", "small" ) ],
				false )
		);
	} );
} );

describe( "A test for building keyword and synonyms stems for a paper", function() {
	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; " +
		"for a language without morphology and function words", function() {
		const keyword = "Ek gaan stap.";
		const synonyms = [ "\"Ek gaan nie stap nie\"", "Jy gaan 'n film kyk", "En hy sal hard werk." ];

		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "Ek", "Ek" ),
					new StemOriginalPair( "gaan", "gaan" ),
					new StemOriginalPair( "stap", "stap" ),
				],
				false
			),
			synonymsStems: [
				new TopicPhrase(
					[
						new StemOriginalPair( "Ek gaan nie stap nie", "Ek gaan nie stap nie" ),
					],
					true
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "Jy", "Jy" ),
						new StemOriginalPair( "gaan", "gaan" ),
						new StemOriginalPair( "n", "n" ),
						new StemOriginalPair( "film", "film" ),
						new StemOriginalPair( "kyk", "kyk" ),
					],
					false
				),
				new TopicPhrase(
					[
						new StemOriginalPair( "En", "En" ),
						new StemOriginalPair( "hy", "hy" ),
						new StemOriginalPair( "sal", "sal" ),
						new StemOriginalPair( "hard", "hard" ),
						new StemOriginalPair( "werk", "werk" ),
					],
					false
				),
			],
		};
		expect( collectStems( keyword, synonyms, baseStemmer, [] ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; " +
		"for an unexisting language (no morphology and function words)", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = [ "\"You are not going for a walk\"", "You are going for a movie", "And he is going to work diligently." ];
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
						new StemOriginalPair( "You", "You" ),
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
						new StemOriginalPair( "And", "And" ),
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
		expect( collectStems( keyword, synonyms, baseStemmer, [] ) ).toEqual( expectedResult );
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const expectedResult = {
			keyphraseStems: { exactMatch: false, stemOriginalPairs: [] },
			synonymsStems: [],
		};
		expect( collectStems( "", [], baseStemmer, [] ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no synonyms were supplied ", function() {
		const keyword = "\"I am going for a walk\"";
		const expectedResult = {
			keyphraseStems: new TopicPhrase(
				[
					new StemOriginalPair( "I am going for a walk", "I am going for a walk" ) ],
				true
			),
			synonymsStems: [],
		};
		expect( collectStems( keyword, [], baseStemmer, [] ) ).toEqual( expectedResult );
	} );
} );


describe( "A test for topic phrase objects", function() {
	const testTopicPhrase = new TopicPhrase(
		[
			new StemOriginalPair( "movie", "movies" ),
			new StemOriginalPair( "work", "work" ),
		],
		false
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

	it( "returns empty array in case of exact match", () => {
		const exactMatchTopicPhrase = new TopicPhrase(
			[
				new StemOriginalPair( "movie", "movie" ),
				new StemOriginalPair( "work", "work" ),
			],
			true
		);
		expect( exactMatchTopicPhrase.getStems() ).toEqual( [] );
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
