import getStemmer from "../../../../../src/languageProcessing/languages/ru/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/ru/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataRU = getMorphologyData( "ru" );

const paper = new Paper(  "", { keyword: "", locale: "ru_RU" }  );

describe( "a test for getting the stemmer for Russian", function() {
	it( "returns the correctly stemmed Russian word when the Russian morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataRU );
		expect( getStemmer( mockResearcher )( "растения" ) ).toEqual( "растен" );
	} );

	it( "doesn't stem the word when the Russian morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "растения" ) ).toEqual( "растения" );
	} );
} );
