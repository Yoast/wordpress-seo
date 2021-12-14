import Researcher from "../../../../../src/languageProcessing/languages/ja/Researcher.js";
import customGetStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/customGetStemmer";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

const paper = new Paper(  "これは日本語のテキストです。", { keyword: "日本語のテキスト", locale: "ja" }  );

describe( "Test for getting the helper to return a canonical stem for Japanese word", () => {
	const mockResearcher = new Researcher( paper );
	it( "creates the word forms when the Japanese morphology data is available", function() {
		mockResearcher.addResearchData( "morphology", morphologyDataJA );
		expect( mockResearcher.getHelper( "getStemmer" )( mockResearcher )( "日帰り" ) ).toEqual(
			[ "日帰る", "日帰り", "日帰ら", "日帰れ", "日帰ろ", "日帰っ", "日帰れる", "日帰らせ",
				"日帰らせる", "日帰られ", "日帰られる", "日帰ろう" ]
		);
	} );

	it( "returns the input word if no morphology data is available", () => {
		expect( customGetStemmer( mockResearcher )( "食べる" ) ).toBe( "食べる" );
	} );
} );
