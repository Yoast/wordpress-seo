import { isFeatureEnabled } from "@yoast/feature-flag";
import Researcher from "../../../../../src/languageProcessing/languages/it/Researcher";
import customGetStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/customGetStemmer";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

const paper = new Paper(  "これは日本語のテキストです。", { keyword: "日本語のテキスト", locale: "ja" }  );

describe( "Test for getting the helper to return a canonical stem for Japanese word", () => {
	if ( isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		it( "returns the forms created when the Japanese morphology data is available", function() {
			const mockResearcher = new Researcher( paper );
			mockResearcher.addResearchData( "morphology", morphologyDataJA );
			expect( customGetStemmer( mockResearcher )( "日帰り" ) ).toEqual( "日帰っ" );
		} );
	}

	it( "returns the input word if no morphology data is available", () => {
		const mockResearcher = new Researcher( paper );

		expect( customGetStemmer( mockResearcher )( "食べる" ) ).toBe( "食べる" );
	} );
} );
