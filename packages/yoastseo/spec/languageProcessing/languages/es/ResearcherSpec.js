import Researcher from "../../../../src/languageProcessing/languages/es/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/es/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/es/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/es/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/es/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/es/config/stopWords";
import syllables from "../../../../src/languageProcessing/languages/es/config/syllables.json";
const morphologyDataES = getMorphologyData( "es" );
import sentenceLength from "../../../../src/languageProcessing/languages/es/config/sentenceLength";

describe( "a test for the Spanish Researcher", function() {
	const researcher = new Researcher( new Paper( "Este es un documento nuevo!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the English Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Spanish Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns the Spanish function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Spanish first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the singleWords Spanish transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Spanish two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Spanish syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the Spanish stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns Spanish sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Spanish locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "es" );
	} );

	it( "returns the Spanish passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the Spanish stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataES );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "gatos" ) ).toEqual( "gat" );
	} );

	it( "splits Spanish sentence into clauses and checks if the clauses are passive or not", function() {
		const sentence = "Ellos eran tres amigos cuando los conocí.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "eran tres amigos" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( false );
	} );

	it( "calculates the Flesch reading score using the formula for Spanish", function() {
		const statistics = {
			numberOfWords: 1000,
			numberOfSentences: 100,
			syllablesPer100Words: 250,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 46.6 );
	} );
} );
