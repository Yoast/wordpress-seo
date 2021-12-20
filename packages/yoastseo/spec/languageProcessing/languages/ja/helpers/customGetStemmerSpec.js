import Researcher from "../../../../../src/languageProcessing/languages/ja/Researcher.js";
import customGetStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/customGetStemmer";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

const paper = new Paper(  "これは日本語のテキストです。", { keyword: "日本語のテキスト", locale: "ja" }  );

describe( "Test for getting the helper to return a canonical stem for Japanese word", () => {
	const mockResearcher = new Researcher( paper );
	it( "returns the stem when the Japanese morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( customGetStemmer( mockResearcher )( "日帰り" ) ).toEqual( "日帰っ" );
	} );

	it( "returns the input word if no morphology data is available", () => {
		expect( customGetStemmer( mockResearcher )( "食べる" ) ).toBe( "食べる" );
	} );
} );
