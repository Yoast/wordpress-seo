import { buildStems, collectStems } from "../../src/researches/buildTopicStems.js";
import getMorphologyData from "../specHelpers/getMorphologyData";

const morphologyDataEN = getMorphologyData( "en" );
const morphologyDataDE = getMorphologyData( "de" );

describe( "A test for building stems for an array of words", function() {
	it( "returns an empty array if the input keyphrase is undefined", function() {
		let keyphrase;
		const forms = buildStems( keyphrase, "en", morphologyDataEN.en );
		expect( forms ).toEqual( [] );
	} );

	it( "returns the exact match if the input string is embedded in quotation marks (the language and morphAnalyzer do not matter)", function() {
		const forms = buildStems( "\"I am going for a walk\"", "en", morphologyDataEN.en );
		expect( forms ).toEqual( [ "I am going for a walk" ] );
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet", function() {
		const forms = buildStems( "Je ne vais pas rire", "fr", false );
		expect( forms ).toEqual( [ "rire" ] );
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet", function() {
		const forms = buildStems( "Como hacer guacamole como los mexicanos", "es", false );
		expect( forms ).toEqual( [ "guacamole", "mexicanos" ] );
	} );

	it( "returns all (content) words if there is no morphological analyzer for this language yet and takes care of apostrophe variations", function() {
		expect( buildStems( "слово'слово", "ru", {} ) ).toEqual( [ "слово'слово" ] );
		expect( buildStems( "слово‘слово", "ru", {} ) ).toEqual( [ "слово'слово" ] );
		expect( buildStems( "слово‛слово", "ru", {} ) ).toEqual( [ "слово'слово" ] );
		expect( buildStems( "слово’слово", "ru", {} ) ).toEqual( [ "слово'слово" ] );
		expect( buildStems( "слово`слово", "ru", {} ) ).toEqual( [ "слово'слово" ] );
	} );

	it( "returns all content words for English if Free", function() {
		const forms = buildStems( "I am walking and singing in the rain", "en", false );
		expect( forms ).toEqual( [ "walking", "singing", "rain" ] );
	} );

	it( "returns stems of all words for English if Premium if only function words are supplied", function() {
		const forms = buildStems( "One and two", "en", morphologyDataEN.en );
		expect( forms ).toEqual( [ "one", "and", "two" ] );
	} );

	it( "returns stems of all content words for English if Premium", function() {
		const forms = buildStems( "I am walking and singing in the rain", "en", morphologyDataEN.en );
		expect( forms ).toEqual( [ "walk", "sing", "rain" ] );
	} );

	it( "returns stems of all content words for German if Premium", function() {
		const forms = buildStems( "Schnell und einfach Altbauwohnungen finden.", "de", morphologyDataDE.de );
		expect( forms ).toEqual( [ "altbauwohnung" ] );
	} );
} );

describe( "A test for building keyword and synonyms stems for a paper", function() {
	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for empty language", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		let language;

		const expectedResult = {
			keyphraseStems: [ "I am going for a walk" ],
			synonymsStems: [
				[ "You are not going for a walk" ],
				[ "movie" ],
				[ "work", "diligent" ],
			],
		};
		expect( collectStems( keyword, synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for English", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseStems: [ "I am going for a walk" ],
			synonymsStems: [
				[ "You are not going for a walk" ],
				[ "movie" ],
				[ "work", "diligent" ],
			],
		};
		expect( collectStems( keyword, synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for French (no morphology yet)", function() {
		const keyword = "Je vais me promener";
		const synonyms = "\"Tu ne vas pas te promener\", Tu vas voir un film, Et lui il va travailler dur.";
		const language = "fr";

		const expectedResult = {
			keyphraseStems: [ "promener" ],
			synonymsStems: [
				[ "Tu ne vas pas te promener" ],
				[ "voir", "film" ],
				[ "travailler", "dur" ],
			],
		};
		expect( collectStems( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns the exact matches if the input strings are embedded in quotation marks and separate words if not; for an unexisting language (no morphology and function words)", function() {
		const keyword = "\"I am going for a walk\"";
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "yep";

		const expectedResult = {
			keyphraseStems: [ "I am going for a walk" ],
			synonymsStems: [
				[ "You are not going for a walk" ],
				[ "you", "are", "going", "for", "a", "movie" ],
				[ "and", "he", "is", "going", "to", "work", "diligently" ],
			],
		};
		expect( collectStems( keyword, synonyms, language, {} ) ).toEqual( expectedResult );
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const expectedResult = {
			keyphraseStems: [],
			synonymsStems: [],
		};
		expect( collectStems( "", "", "en_EN", morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no keyword was supplied ", function() {
		const synonyms = "\"You are not going for a walk\", You are going for a movie, And he is going to work diligently.";
		const language = "en";

		const expectedResult = {
			keyphraseStems: [],
			synonymsStems: [
				[ "You are not going for a walk" ],
				[ "movie" ],
				[ "work", "diligent" ],
			],
		};
		expect( collectStems( "", synonyms, language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );

	it( "returns an empty field if no synonyms were supplied ", function() {
		const keyword = "\"I am going for a walk\"";
		const language = "en";

		const expectedResult = {
			keyphraseStems: [ "I am going for a walk" ],
			synonymsStems: [],
		};
		expect( collectStems( keyword, "", language, morphologyDataEN.en ) ).toEqual( expectedResult );
	} );
} );
