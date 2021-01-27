import Researcher from "../../../../src/languageProcessing/languages/de/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/de/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/de/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/de/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/de/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/de/config/stopWords";
import syllables from "../../../../src/languageProcessing/languages/de/config/syllables.json";
const morphologyDataDE = getMorphologyData( "de" );

describe( "a test for the German Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the German Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns the German function words ", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the German first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the German transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the German two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the German syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the German stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the German locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "de" );
	} );

	it( "returns the German passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the German stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataDE );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "Katzen" ) ).toEqual( "Katz" );
	} );

	it( "splits German sentence into parts", function() {
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "Zwischen 1927" );
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 1 ].getSentencePartText() ).toBe( "und 1933 hatte sie" +
			" intensiven Kontakt zur Erzabtei Beuron." );
	} );

	it( "checks if a German sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Sie wird geliebt", [ "wird" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Sie hat ihren Hund geliebt", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for German", function() {
		const testStatistics = {
			numberOfSentences: 10,
			numberOfWords: 50,
			numberOfSyllables: 100,
			averageWordsPerSentence: 5,
			syllablesPer100Words: 200,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( testStatistics ) ).toBe( 58 );
	} );
} );
