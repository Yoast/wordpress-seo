import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import keyphraseLength from "../../../src/languageProcessing/researches/keyphraseLength.js";
import Paper from "../../../src/values/Paper.js";

const morphologyData = getMorphologyData( "en" );

describe( "the keyphrase length research", function() {
	it( "should count the words in the input", function() {
		const paper = new Paper( "", { keyword: "word word" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const result = keyphraseLength( paper, researcher );

		expect( result.keyphraseLength ).toBe( 2 );
	} );
} );

describe( "the keyphrase length research", function() {
	it( "should count the words in the input and filters function words", function() {
		const paper = new Paper( "", { keyword: "word word the word" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const result = keyphraseLength( paper, researcher );

		expect( result.keyphraseLength ).toBe( 3 );
	} );
} );

/*
describe( "the keyphrase length research", function() {
	it( "should count the words in the input and filters function words", function() {
		const paper = new Paper( "", { keyword: "mot mot le mot", locale: "fr_FR" } );
		const researcher = new FrenchResearcher( paper );

		const result = keyphraseLength( paper, researcher );

		expect( result.keyphraseLength ).toBe( 3 );
	} );
} );
*/

describe( "the keyphrase length research for empty keyword", function() {
	it( "should count the words in the input", function() {
		const paper = new Paper( "", { keyword: "" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const result = keyphraseLength( paper, researcher );

		expect( result.keyphraseLength ).toBe( 0 );
	} );
} );
