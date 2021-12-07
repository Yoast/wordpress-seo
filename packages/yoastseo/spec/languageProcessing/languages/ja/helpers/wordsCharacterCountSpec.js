import wordsCharacterCount from "../../../../../src/languageProcessing/languages/ja/helpers/wordsCharacterCount";

describe( "test for counting the characters of Japanese words in an array", function() {
	it( "returns 0 if the input is an empty array", function() {
		const characterCount = wordsCharacterCount( [] );

		expect( characterCount ).toEqual( 0 );
	} );
	it( "returns character counts of an array of Japanese words", function() {
		const array = [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ];
		expect( wordsCharacterCount( array ) ).toEqual( 32 );
	} );
} );
