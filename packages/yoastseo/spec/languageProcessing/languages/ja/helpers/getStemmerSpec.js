import Researcher from "../../../../../src/languageProcessing/languages/it/Researcher";
import getStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/getStemmer";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";
import { isFeatureEnabled } from "@yoast/feature-flag";

const morphologyDataJA = getMorphologyData( "ja" );

const paper = new Paper(  "これは日本語のテキストです。", { keyword: "日本語のテキスト", locale: "ja" }  );

describe( "Test for getting the helper to create word forms for Japanese word", () => {
	if ( isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		it( "returns the forms created when the Japanese morphology data is available", function() {
			const mockResearcher = new Researcher( paper );
			mockResearcher.addResearchData( "morphology", morphologyDataJA );
			expect( getStemmer( mockResearcher )( "日帰り" ) ).toEqual( [
				"日帰る", "日帰り", "日帰ら", "日帰れ", "日帰ろ", "日帰っ", "日帰れる", "日帰らせ",
				"日帰らせる", "日帰られ", "日帰られる", "日帰ろう",
			] );
		} );
	}
	it( "returns the input word if no morphology data is available", () => {
		const mockResearcher = new Researcher( paper );

		expect( getStemmer( mockResearcher )( "食べる" ) ).toBe( "食べる" );
	} );
} );
