import getStemmer from "../../../../../src/languageProcessing/languages/cz/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/cz/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataCZ = getMorphologyData( "cz" );

const paper = new Paper(  "", { keyword: "", locale: "cz_CZ" }  );

describe( "a test for getting the stemmer for Czech", function() {
	it( "returns the correctly stemmed Czech word when the Czech morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataCZ );
		expect( getStemmer( mockResearcher )( "hranic" ) ).toEqual( "hran" );
	} );

	it( "doesn't stem the word when the Czech morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "hranic" ) ).toEqual( "hranic" );
	} );
} );
