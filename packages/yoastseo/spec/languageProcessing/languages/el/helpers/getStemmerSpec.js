import Paper from "../../../../../src/values/Paper";
import getStemmer from "../../../../../src/languageProcessing/languages/el/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/sk/Researcher";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataEL = getMorphologyData( "el" );

const paper = new Paper(  "", { keyword: "", locale: "el" }  );

describe( "Test for the base stemmer where it returns the input word", () => {
	it( "returns the correctly stemmed Greek word when the Greek morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataEL );
		expect( getStemmer( mockResearcher )( "αγαπάς" ) ).toEqual( "αγαπ" );
	} );

	it( "doesn't stem the word when the Greek morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "γάτες" ) ).toEqual( "γάτες" );
	} );
} );
