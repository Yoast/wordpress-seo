import { isFeatureEnabled } from "@yoast/feature-flag";
import determineStem from "../../../../../../src/languageProcessing/languages/ja/helpers/internal/determineStem";

import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" ).ja;

describe( "Test for getting the helper to return a canonical stem for Japanese word", () => {
	if ( ! isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		it( "is not run when the Japanese feature flag is disabled", function() {} );
		return;
	}
	it( "returns the original word if the word is one character long or if the word doesn't match anny paradigm", function() {
		expect( determineStem( "猫", morphologyDataJA ) ).toEqual( "猫" );
		expect( determineStem( "バラ", morphologyDataJA ) ).toEqual( "バラ" );
	} );
	it( "returns the canonical stem for an input word that ends in vowel group ending, e.g. -わせる", () => {
		expect( determineStem( "会わせる", morphologyDataJA ) ).toBe( "会い" );
	} );
	it( "returns the canonical stem for an input word that ends in T group ending", () => {
		expect( determineStem( "待つ", morphologyDataJA ) ).toBe( "待た" );
	} );
	it( "returns the canonical stem for an input word that ends in R group ending", () => {
		expect( determineStem( "頑張り", morphologyDataJA ) ).toBe( "頑張っ" );
	} );
	it( "returns the canonical stem for an input word that ends in N group ending", () => {
		expect( determineStem( "死な", morphologyDataJA ) ).toBe( "死な" );
	} );
	it( "returns the canonical stem for an input word that ends in M group ending", () => {
		expect( determineStem( "休め", morphologyDataJA ) ).toBe( "休ま" );
	} );
	it( "returns the canonical stem for an input word that ends in B group ending", () => {
		expect( determineStem( "及ぼ", morphologyDataJA ) ).toBe( "及ば" );
	} );
	it( "returns the canonical stem for an input word that ends in K group ending", () => {
		expect( determineStem( "遅かっ", morphologyDataJA ) ).toBe( "遅い" );
	} );
	it( "returns the canonical stem for an input word that ends in G group ending", () => {
		expect( determineStem( "脱げる", morphologyDataJA ) ).toBe( "脱い" );
	} );
	it( "returns the canonical stem for an input word that ends in S group ending", () => {
		expect( determineStem( "話させる", morphologyDataJA ) ).toBe( "話さ" );
	} );
	it( "returns the canonical stem for the input word that ends in -る", () => {
		expect( determineStem( "見る", morphologyDataJA ) ).toBe( "見" );
	} );
} );
