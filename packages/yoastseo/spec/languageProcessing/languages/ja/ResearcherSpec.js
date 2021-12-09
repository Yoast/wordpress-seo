import Researcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/ja/config/functionWords";
import sentenceLength from "../../../../src/languageProcessing/languages/ja/config/sentenceLength";

import getMorphologyData from "../../../specHelpers/getMorphologyData";
import { isFeatureEnabled } from "@yoast/feature-flag";

const morphologyDataJA = getMorphologyData( "ja" );

describe( "a test for Japanese Researcher", function() {
	const researcher = new Researcher( ( new Paper( "", { keyword: "小さい花の刺繍" } ) ) );

	it( "returns true if the Japanese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Japanese Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns the Japanese sentence length configuration", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Japanese function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns the keyphrase length", function() {
		expect( researcher.getResearch( "keyphraseLength" ).keyphraseLength ).toEqual( 7 );
	} );

	if ( isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		it( "returns the keyphrase unaltered when the Japanese morphology data is not available", function() {
			expect( researcher.getHelper( "getStemmer" )( researcher )( "日帰り" ) ).toEqual(
				"日帰り" );
		} );

		it( "creates the word forms when the Japanese morphology data is available", function() {
			researcher.addResearchData( "morphology", morphologyDataJA );
			expect( researcher.getHelper( "getStemmer" )( researcher )( "日帰り" ) ).toEqual(
				[
					"日帰る", "日帰り", "日帰ら", "日帰れ", "日帰ろ", "日帰っ", "日帰れる", "日帰らせ",
					"日帰らせる", "日帰られ", "日帰られる", "日帰ろう",
				]
			);
		} );
	}
} );
