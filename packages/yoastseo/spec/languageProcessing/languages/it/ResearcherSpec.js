import Researcher from "../../../../src/languageProcessing/languages/it/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataIT = getMorphologyData( "it" );
import functionWords from "../../../../src/languageProcessing/languages/it/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/it/config/firstWordExceptions";
import stopWords from "../../../../src/languageProcessing/languages/it/config/stopWords";
import transitionWords from "../../../../src/languageProcessing/languages/it/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/it/config/twoPartTransitionWords";
import syllables from "../../../../src/languageProcessing/languages/it/config/syllables.json";
import sentenceLength from "../../../../src/languageProcessing/languages/it/config/sentenceLength";

describe( "a test for the Italian Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Italian Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Italian Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns the Italian function words filtered at the beginning", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Italian first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Italian transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Italian two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns a specified part of the Italian syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the Italian stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns Italian sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Italian locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "it" );
	} );

	it( "returns the Italian passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the Italian stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataIT );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "gatto" ) ).toEqual( "gatt" );
	} );

	it( "splits Italian sentence into parts", function() {
		const sentence =  "Furono tre amici quando furono bambini.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "Furono tre amici" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "furono bambini." );
	} );

	it( "calculates the Flesch reading score using the formula for Italian", function() {
		const statistics = {
			averageWordsPerSentence: 19,
			syllablesPer100Words: 250,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 42.3 );
	} );
} );
