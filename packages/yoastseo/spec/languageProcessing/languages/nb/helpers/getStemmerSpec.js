import getStemmer from "../../../../../src/languageProcessing/languages/nb/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/nb/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataNB = getMorphologyData( "nb" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "nb_NO" }  );

describe( "a test for getting the stemmer for Norwegian", function() {
	it( "returns the correctly stemmed Norwegian word when the Norwegian morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataNB );
		expect( getStemmer( mockResearcher )( "katter" ) ).toEqual( "katt" );
	} );

	it( "doesn't stem the word when the Norwegian morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "katter" ) ).toEqual( "katter" );
	} );
} );

