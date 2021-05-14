import getStemmer from "../../../../../src/languageProcessing/languages/es/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/es/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataES = getMorphologyData( "es" );

const paper = new Paper(  "Este es el gato más especial.", { keyword: "gato especial", locale: "es_ES" }  );

describe( "a test for getting the stemmer for Spanish", function() {
	it( "returns the correctly stemmed Spanish word when the Spanish morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataES );
		expect( getStemmer( mockResearcher )( "gatos" ) ).toEqual( "gat" );
	} );

	it( "doesn't stem the word when the Spanish morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "gatas" ) ).toEqual( "gatas" );
	} );
} );
