import getStemmer from "../../../../../src/languageProcessing/languages/id/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/id/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataID = getMorphologyData( "id" );

const paper = new Paper(  "Kucing adalah hewan paling sepsial.", { keyword: "kucing spesial", locale: "id_ID" }  );

describe( "a test for getting the stemmer for Indonesian", function() {
	it( "returns the correctly stemmed Indonesian word when the Arabic morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataID );
		expect( getStemmer( mockResearcher )( "kucingnya" ) ).toEqual( "kucing" );
	} );

	it( "doesn't stem the word when the Indonesian morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "kucingkulah" ) ).toEqual( "kucingkulah" );
	} );
} );

