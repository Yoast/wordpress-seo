import Researcher from "../../../../src/languageProcessing/languages/nl/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataNL = getMorphologyData( "nl" );
import functionWords from "../../../../src/languageProcessing/languages/nl/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/nl/config/firstWordExceptions";
import stopWords from "../../../../src/languageProcessing/languages/nl/config/stopWords";
import transitionWords from "../../../../src/languageProcessing/languages/nl/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/nl/config/twoPartTransitionWords";
import syllables from "../../../../src/languageProcessing/languages/nl/config/syllables.json";

describe( "a test for the Dutch Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Dutch Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Dutch Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns the Dutch function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Dutch stopwords", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the Dutch first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Dutch transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Dutch two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns a specified part of the Dutch syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the Dutch locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "nl" );
	} );

	it( "returns the Dutch passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the Dutch stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataNL );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "katten" ) ).toEqual( "kat" );
	} );

	it( "splits Dutch sentence into parts", function() {
		const sentence = "De kat werd geadopteerd zodra hij werd gezien.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "De kat werd geadopteerd" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "zodra hij werd gezien." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toBe( true );
	} );

	it( "calculates the Flesch reading score using the formula for Dutch", function() {
		const testStatistics = {
			numberOfSentences: 10,
			numberOfWords: 50,
			numberOfSyllables: 100,
			averageWordsPerSentence: 5,
			syllablesPer100Words: 200,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( testStatistics ) ).toBe( 48.2 );
	} );
} );
