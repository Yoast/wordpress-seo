import Researcher from "../../../../src/languageProcessing/languages/hu/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/hu/config/functionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import transitionWords from "../../../../src/languageProcessing/languages/hu/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/hu/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/hu/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/hu/config/stopWords";

const morphologyDataHU = getMorphologyData( "hu" );

describe( "a test for the Hungarian Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Hungarian Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Hungarian Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns Hungarian function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns Hungarian transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns Hungarian two-part transition words words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns Hungarian first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns Hungarian first word exceptions", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the Hungarian locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "hu" );
	} );

	it( "returns the Hungarian passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphologicalAndPeriphrastic" );
	} );

	it( "stems the Hungarian word using the Hungarian stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataHU );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "abrosszal" ) ).toEqual( "abrosz" );
	} );

	it( "splits Hungarian sentence into clauses", function() {
		const sentence =  "Az ajtó be van csukva és Mari szeretve van.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "be van csukva" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "és Mari szeretve van." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toBe( true );
	} );

	it( "checks if a Hungarian sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "A telefon gyorsan töltődik." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Teát iszom." ) ).toEqual( false );
	} );
} );
