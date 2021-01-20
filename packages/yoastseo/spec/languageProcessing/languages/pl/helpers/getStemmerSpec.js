import getStemmer from "../../../../../src/languageProcessing/languages/pl/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/pl/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataPL = getMorphologyData( "pl" );

const paper = new Paper(  "", { keyword: "", locale: "pl_PL" }  );

describe( "a test for getting the stemmer for Polish", function() {
	it( "returns the correctly stemmed Polish word when the Polish morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataPL );
		expect( getStemmer( mockResearcher )( "rośliny" ) ).toEqual( "roślin" );
	} );

	it( "doesn't stem the word when the Polish morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "rośliny" ) ).toEqual( "rośliny" );
	} );
} );
