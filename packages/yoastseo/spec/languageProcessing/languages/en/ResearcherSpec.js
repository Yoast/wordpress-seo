import Researcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataEN = getMorphologyData( "en" );

describe( "a test for the English Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the English Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns the English function words filtered at the end", function() {
		expect( researcher.getConfig( "functionWords" ).filteredAtEnding ).toEqual(
			[ "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh",
				"twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth",
				"twentieth", "doing", "daring", "having", "appearing", "becoming", "coming", "keeping", "remaining", "staying",
				"saying", "asking", "stating", "seeming", "letting", "making", "setting", "showing", "putting", "adding", "going",
				"using", "trying", "containing", "new", "newer", "newest", "old", "older", "oldest", "previous", "good",
				"well", "better", "best", "big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest",
				"far", "hard", "harder", "hardest", "least", "own", "large", "larger", "largest", "long", "longer", "longest",
				"low", "lower", "lowest", "high", "higher", "highest", "regular", "simple", "simpler", "simplest", "small",
				"smaller", "smallest", "tiny", "tinier", "tiniest", "short", "shorter", "shortest", "main", "actual", "nice",
				"nicer", "nicest", "real", "same", "able", "certain", "usual", "so-called", "mainly", "mostly", "recent",
				"anymore", "complete", "lately", "possible", "commonly", "constantly", "continually", "directly", "easily",
				"nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar", "widely", "bad", "worse",
				"worst", "great", "specific", "available", "average", "awful", "awesome", "basic", "beautiful", "busy", "current",
				"entire", "everywhere", "important", "major", "multiple", "normal", "necessary", "obvious", "partly", "special",
				"last", "early", "earlier", "earliest", "young", "younger", "youngest", "" ]
		);
	} );

	it( "returns the English first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual(
			[ "the", "a", "an", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
				"this", "that", "these", "those" ]
		);
	} );

	it( "returns the English transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( [
			"accordingly", "additionally", "afterward", "afterwards", "albeit", "also", "although", "altogether",
			"another", "basically", "because", "before", "besides", "but", "certainly", "chiefly", "comparatively",
			"concurrently", "consequently", "contrarily", "conversely", "correspondingly", "despite", "doubtedly", "during",
			"e.g.", "earlier", "emphatically", "equally", "especially", "eventually", "evidently", "explicitly", "finally",
			"firstly", "following", "formerly", "forthwith", "fourthly", "further", "furthermore", "generally", "hence",
			"henceforth", "however", "i.e.", "identically", "indeed", "initially", "instead", "last", "lastly", "later", "lest",
			"likewise", "markedly", "meanwhile", "moreover", "nevertheless", "nonetheless", "nor",  "notwithstanding", "obviously",
			"occasionally", "otherwise", "overall", "particularly", "presently", "previously", "rather", "regardless", "secondly",
			"shortly", "significantly", "similarly", "simultaneously", "since", "so", "soon", "specifically", "still", "straightaway",
			"subsequently", "surely", "surprisingly", "than", "then", "thereafter", "therefore", "thereupon", "thirdly", "though",
			"thus", "till", "undeniably", "undoubtedly", "unless", "unlike", "unquestionably", "until", "when", "whenever",
			"whereas", "while", "above all", "after all", "after that", "all in all", "all of a sudden", "all things considered",
			"analogous to", "although this may be true", "analogous to", "another key point", "as a matter of fact", "as a result",
			"as an illustration", "as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown",
			"as long as", "as much as", "as opposed to", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last",
			"at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time",
			"balanced against", "being that", "by all means", "by and large", "by comparison", "by the same token", "by the time",
			"compared to", "be that as it may", "coupled with", "different from", "due to", "equally important", "even if",
			"even more", "even so", "even though", "first thing to remember", "for example", "for fear that", "for instance",
			"for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose",
			"for this reason", "from time to time", "given that", "given these points", "important to realize", "in a word", "in addition",
			"in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast",
			"in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of",
			"in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality",
			"in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that",
			"in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of",
			"in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place",
			"in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as",
			"most compelling evidence", "most important", "must be remembered", "not only", "not to mention", "note that",
			"now that", "of course", "on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary",
			"on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once",
			"once in a while", 	"only if", "owing to", "point often overlooked", "prior to", "provided that", "seeing that",
			"so as to", "so far", "so long as", "so that", "sooner or later", "such as", "summing up", "take the case of",
			"that is", "that is to say", "then again", "this time", "to be sure", "to begin with", "to clarify", "to conclude",
			"to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "to list", "to point out",
			"to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up",
			"to summarize", "to that end", "to the end that", "to this end", "together with", "under those circumstances", "until now",
			"up against", "up to the present time", "vis a vis", "what's more", "while it may be true", "while this may be true",
			"with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind",
			"without a doubt", "without delay", "without doubt", "without reservation",
		] );
	} );

	it( "returns the English two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual(
			[ [ "both", "and" ], [ "if", "then" ], [ "not only", "but also" ], [ "neither", "nor" ], [ "either", "or" ], [ "not", "but" ],
				[ "whether", "or" ], [ "no sooner", "than" ] ]
		);
	} );

	it( "returns a specified part of the English syllables data", function() {
		expect( researcher.getConfig( "syllables" ).deviations.words.fragments ).toEqual(
			{
				global: [
					{
						word: "coyote",
						syllables: 3,
					},
					{
						word: "graveyard",
						syllables: 2,
					},
					{
						word: "lawyer",
						syllables: 2,
					},
				],
			}
		);
	} );

	it( "returns the English stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual(
			[
				"to",
				"which",
				"who",
				"whom",
				"that",
				"whose",
				"after",
				"although",
				"as",
				"because",
				"before",
				"even if",
				"even though",
				"how",
				"if",
				"in order that",
				"inasmuch",
				"lest",
				"once",
				"provided",
				"since",
				"so that",
				"than",
				"though",
				"till",
				"unless",
				"until",
				"when",
				"whenever",
				"where",
				"whereas",
				"wherever",
				"whether",
				"while",
				"why",
				"by the time",
				"supposing",
				"no matter",
				"how",
				"what",
				"won't",
				"do",
				"does",
				"–",
				"and",
				"but",
				"or",
			]
		);
	} );

	it( "returns the English locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "en" );
	} );

	it( "returns the English passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the English stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataEN );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "cats" ) ).toEqual( "cat" );
	} );

	it( "splits English sentence into parts", function() {
		const sentence =  "The English are still having a party.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "are still" );
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 1 ].getSentencePartText() ).toBe( "having a party." );
	} );

	it( "checks if a English sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "The cats are vaccinated.", [ "are" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "The girl loves her cat.", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for English", function() {
		const statistics = {
			numberOfWords: 400,
			numberOfSyllables: 800,
			averageWordsPerSentence: 20,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 17.3 );
	} );
} );
