import Researcher from "../../../../src/languageProcessing/languages/tr/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import firstWordExceptions from "../../../../src/languageProcessing/languages/tr/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/tr/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/tr/config/twoPartTransitionWords";
import functionWords from "../../../../src/languageProcessing/languages/tr/config/functionWords";
import sentenceLength from "../../../../src/languageProcessing/languages/tr/config/sentenceLength";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataTR = getMorphologyData( "tr" );

describe( "a test for Turkish Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Turkish Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Turkish Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Turkish Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns all Turkish function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns the Turkish first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Turkish transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Turkish two part transition words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Turkish sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Turkish locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "tr" );
	} );

	it( "returns the Turkish passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "stems the Turkish word using the Turkish stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataTR );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "tulkarem" ) ).toEqual( "tulkare" );
	} );

	it( "checks if an Turkish sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "Camlar dün temizlendi." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Bu sabah okula yürüdü" ) ).toEqual( false );
	} );
} );
