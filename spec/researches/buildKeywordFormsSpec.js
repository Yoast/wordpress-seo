const Paper = require( "../../js/values/Paper" );
const Researcher = require( "../../js/researcher" );

const buildKeywordForms = require( "../../js/researches/buildKeywordForms.js" );
const filterFunctionWords = buildKeywordForms.filterFunctionWords;
const buildForms = buildKeywordForms.buildForms;
const collectForms = buildKeywordForms.collectForms;
const collectFormsMemoized = buildKeywordForms.collectFormsMemoized;

const morphologyData = require( "../../js/morphology/english/englishMorphology.json" );

describe( "A test for filtering out function words from an array of words for a given language", function() {
	it( "returns the array of content words for absent locale", function() {
		const filteredArray = filterFunctionWords( [ "I", "am", "going", "for", "a", "walk" ] );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the array of content words for an empty language as if it was English", function() {
		const filteredArray = filterFunctionWords( [ "I", "am", "going", "for", "a", "walk" ], "" );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the original array of words for a non-existing language", function() {
		const filteredArray = filterFunctionWords( [ "I", "am", "going", "for", "a", "walk" ], "yep" );
		expect( filteredArray ).toEqual( [ "I", "am", "going", "for", "a", "walk" ] );
	} );

	it( "returns the array of content words for English", function() {
		const filteredArray = filterFunctionWords( [ "I", "am", "going", "for", "a", "walk" ], "en" );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the array of content words for French", function() {
		const filteredArray = filterFunctionWords( [ "Je", "ne", "vais", "pas", "rire" ], "fr" );
		expect( filteredArray ).toEqual( [].concat( "rire" ) );
	} );

	it( "returns the array of content words for Spanish", function() {
		const filteredArray = filterFunctionWords( [ "Como", "hacer", "guacamole", "como", "los", "mexicanos" ], "es" );
		expect( filteredArray ).toEqual( [].concat( "guacamole", "mexicanos" ) );
	} );
} );

const movieForms = [ "movie", "movies", "movie's", "movies's", "movies'", "moviing", "movied", "moviely",
	"movier", "moviest", "movie‘s", "movie’s", "movie‛s", "movie`s", "movies‘s", "movies’s", "movies‛s",
	"movies`s", "movies‘", "movies’", "movies‛", "movies`" ];

const workForms = [ "work", "works", "work's", "works's", "works'", "working", "worked", "workly", "worker",
	"workest", "work‘s", "work’s", "work‛s", "work`s", "works‘s", "works’s", "works‛s", "works`s", "works‘",
	"works’", "works‛", "works`" ];

const diligentlyForms = [ "diligently", "diligentlies", "diligently's", "diligentlies's", "diligentlies'",
	"diligentlying", "diligentlied", "diligent", "diligently‘s", "diligently’s", "diligently‛s", "diligently`s",
	"diligentlies‘s", "diligentlies’s", "diligentlies‛s", "diligentlies`s", "diligentlies‘", "diligentlies’",
	"diligentlies‛", "diligentlies`" ];

const oneForms = [ "one", "ones", "one's", "ones's", "ones'", "oning", "oned", "onely", "oner", "onest", "one‘s",
	"one’s", "one‛s", "one`s", "ones‘s", "ones’s", "ones‛s", "ones`s", "ones‘", "ones’", "ones‛", "ones`" ];

const andForms = [ "and", "ands", "and's", "ands's", "ands'", "anding", "anded", "andly", "ander", "andest",
	"and‘s", "and’s", "and‛s", "and`s", "ands‘s", "ands’s", "ands‛s", "ands`s", "ands‘", "ands’", "ands‛", "ands`" ];

const twoForms = [ "two", "twos", "two's", "twos's", "twos'", "twoes", "twoing", "twoed", "twoly", "twoer", "twoest",
	"two‘s", "two’s", "two‛s", "two`s", "twos‘s", "twos’s", "twos‛s", "twos`s", "twos‘", "twos’", "twos‛", "twos`" ];

describe( "A test for building forms of words for an array of words", function() {
	it( "returns an empty array if the input keyphrase is undefined", function() {
		let keyphrase;
		const forms = buildForms( keyphrase, "en", morphologyData );
		expect( forms ).toEqual( [] );
	} );

	it( "returns the exact match if the input string is embedded in quotation marks (the language and morphAnalyzer do not matter)", function() {
		const forms = buildForms( "\"I am going for a walk\"", "en", morphologyData );
		expect( forms ).toEqual( [ [ "I am going for a walk" ] ] );
	} );

	it( "returns the single-word arrays for all words if there is no morphological analyzer for this language yet", function() {
		const forms = buildForms( "Je ne vais pas rire", "fr", false );
		expect( forms ).toEqual( [ [ "rire" ] ] );
	} );

	it( "returns the single-word arrays for all words if there is no morphological analyzer for this language yet", function() {
		const forms = buildForms( "Como hacer guacamole como los mexicanos", "es", false );
		expect( forms ).toEqual( [ [ "guacamole" ], [ "mexicanos" ] ] );
	} );

	it( "returns the single-word arrays for all words if there is no morphological analyzer for this language yet and takes care of apostrophe variations", function() {
		const forms = buildForms( "слово'слово", "ru", {} );
		expect( forms ).toEqual( [ [ "слово'слово", "слово‘слово", "слово’слово", "слово‛слово", "слово`слово" ] ] );
	} );

	it( "returns the single word arrays for all content words for English if Free", function() {
		const forms = buildForms( "I am going for a walk", "en", false );
		expect( forms ).toEqual( [ [ "walk" ] ] );
	} );

	it( "returns the arrays for all forms for English if Premium if only function words are supplied", function() {
		const forms = buildForms( "One and two", "en", morphologyData );
		expect( forms ).toEqual( [ oneForms, andForms, twoForms ] );
	} );
} );

describe( "A test for building keyword and synonyms forms for a paper", function() {
	it( "returns the exact matches if the input strings are embedded in quotation marks and word forms if not; for empty language", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		let language;

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( collectForms( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
		expect( collectFormsMemoized( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and word forms if not; for English", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( collectForms( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
		expect( collectFormsMemoized( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and single-word arrays if not; for French (no morphology yet)", function() {
		const keyword = "Je vais me promener";
		const synonyms = "\"Tu ne vas pas te promener\", Tu vas voir un film, Et lui il va travailler dur.";
		const language = "fr";

		const expectedResult = {
			keyphraseForms: [ [ "promener" ] ],
			synonymsForms: [
				[ [ "Tu ne vas pas te promener" ] ],
				[ [ "voir" ], [ "film" ] ],
				[ [ "travailler" ], [ "dur" ] ],
			],
		};
		expect( collectForms( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
		expect( collectFormsMemoized( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and single-word arrays if not; for an unexisting language (no morphology and function words)", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "yep";

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ [ "you" ], [ "are" ], [ "going" ], [ "for" ], [ "a" ], [ "movie" ] ],
				[ [ "and" ], [ "he" ], [ "is" ], [ "going" ], [ "to" ], [ "work" ], [ "diligently" ] ],
			],
		};
		expect( collectForms( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
		// TODO: expect( collectFormsMemoized( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const keyword = "";
		const synonyms = "";
		const language = "en_EN";

		const expectedResult = {
			keyphraseForms: [],
			synonymsForms: [],
		};
		expect( collectForms( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
		expect( collectFormsMemoized( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no keyword was supplied ", function() {
		const keyword = "";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseForms: [],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( collectForms( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
		// TODO: expect( collectFormsMemoized( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no synonyms were supplied ", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "";
		const language = "en";

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [],
		};
		expect( collectForms( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
		// TODO: expect( collectFormsMemoized( keyword, synonyms, language, morphologyData ) ).toEqual( expectedResult );
	} );
} );


describe( "A test for building keyword and synonyms forms for a paper (called from a researcher)", function() {
	it( "returns the keyphrase and synonyms word forms for English", function() {
		const keyword = "I am going to work";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		let locale;

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [ workForms ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and word forms if not; for empty locale", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		let locale;

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and word forms if not; for English", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const locale = "en_EN";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and single-word arrays if not; for French (no morphology yet)", function() {
		const keyword = "Je vais me promener";
		const synonyms = "\"Tu ne vas pas te promener\", Tu vas voir un film, Et lui il va travailler dur.";
		const locale = "fr_FR";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [ [ "promener" ] ],
			synonymsForms: [
				[ [ "Tu ne vas pas te promener" ] ],
				[ [ "voir" ], [ "film" ] ],
				[ [ "travailler" ], [ "dur" ] ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and single-word arrays if not; for an unexisting locale (no morphology and function words)", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const locale = "yep_YEP";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ [ "you" ], [ "are" ], [ "going" ], [ "for" ], [ "a" ], [ "movie" ] ],
				[ [ "and" ], [ "he" ], [ "is" ], [ "going" ], [ "to" ], [ "work" ], [ "diligently" ] ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const keyword = "";
		const synonyms = "";
		const locale = "en_EN";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [],
			synonymsForms: [],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no keyword was supplied ", function() {
		const keyword = "";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const locale = "en_EN";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [],
			synonymsForms: [
				[ [ "You are not going for a walk" ] ],
				[ movieForms ],
				[ workForms, diligentlyForms ],
			],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no synonyms were supplied ", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "";
		const locale = "en_EN";

		const paper = new Paper( "", { keyword: keyword, synonyms: synonyms, locale: locale } );
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", () => {
			return morphologyData;
		} );

		const expectedResult = {
			keyphraseForms: [ [ "I am going for a walk" ] ],
			synonymsForms: [],
		};
		expect( researcher.getResearch( "morphology" ) ).toEqual( expectedResult );
	} );
} );
