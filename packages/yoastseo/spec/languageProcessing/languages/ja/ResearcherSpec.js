import Researcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/ja/config/functionWords";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

describe( "a test for Japanese Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the Japanese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Japanese Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "creates the word forms when the Japanese morphology data is available", function() {
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( researcher.getHelper( "getStemmer" )( researcher ) ).toEqual( baseStemmer );
	} );
} );
