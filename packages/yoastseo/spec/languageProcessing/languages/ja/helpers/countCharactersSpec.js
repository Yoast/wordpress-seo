import countCharactersFunction from "../../../../../src/languageProcessing/languages/ja/helpers/countCharacters.js";

describe( "counts characters in a string", function() {
	it( "returns the number of characters", function() {
		expect( countCharactersFunction( "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、" +
			"高速運転が可能な標準軌新線を建設することを決定。1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、" +
			"東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した。" ) ).toBe( 136 );
	} );
	it( "makes sure the countCharacters function still works when the input is a non-Japanese string", function() {
		expect( countCharactersFunction( "this is a string" ) ).toBe( 16 );
		expect( countCharactersFunction( "Низът в компютърните науки е крайна поредица от символи " +
			"(представляващи краен брой знаци)." ) ).toBe( 90 );
	} );
} );
