import getStemmer from "../../../../../src/languageProcessing/languages/sv/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/sv/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataSV = getMorphologyData( "sv" );

const paper = new Paper(  "", { keyword: "", locale: "sv_SE" }  );

describe( "a test for getting the stemmer for Swedish", function() {
	it( "returns the correctly stemmed Swedish word when the Swedish morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataSV );
		expect( getStemmer( mockResearcher )( "barnslighet" ) ).toEqual( "barns" );
	} );

	it( "doesn't stem the word when the Swedish morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "barnslighet" ) ).toEqual( "barnslighet" );
	} );
} );
