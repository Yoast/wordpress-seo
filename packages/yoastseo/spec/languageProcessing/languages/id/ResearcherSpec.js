import Researcher from "../../../../src/languageProcessing/languages/id/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import firstWordExceptions from "../../../../src/languageProcessing/languages/id/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/id/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/id/config/twoPartTransitionWords";
import functionWords from "../../../../src/languageProcessing/languages/id/config/functionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataID = getMorphologyData( "id" );

describe( "a test for Indonesian Researcher", function() {
	const researcher = new Researcher( new Paper( "Ini adalah Paper!." ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Indonesian Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Indonesian Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Indonesian Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns all Indonesian function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Indonesian first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Indonesian transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Indonesian two part transition words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Indonesian locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "id" );
	} );

	it( "returns the Indonesian passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "stems the Indonesian word using the Indonesian stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataID );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "kucingnya" ) ).toEqual( "kucing" );
	} );

	it( "checks if an Indonesian sentence is passive or not", function() {
		// Passive verb: disayang
		expect( researcher.getHelper( "isPassiveSentence" )( "Kucing itu amat disayang oleh keluarga Dani." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Bunga amat sayang kucingnya." ) ).toEqual( false );
	} );
} );
