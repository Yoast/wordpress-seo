import findMultiWordKeyphrase from "../../../../../src/languageProcessing/languages/ja/helpers/findExactMatchMultiWordKeyphraseInTitle";
import functionWords from "../../../../../src/languageProcessing/languages/ja/config/functionWords";

describe( "Finds an exact match of a keyphrase in a page title", function() {
	it( "finds an exact match at the beginning of the title", function() {
		const result = findMultiWordKeyphrase( "東海道新幹線の駅構内および列車内に広告を掲出することを。", "東海道新幹線", functionWords );
		expect( result ).toEqual( {
			exactMatchFound: true,
			allWordsFound: true,
			position: 0,
		} );
	} );
	it( "finds an exact match preceded by function words at the beginning of the title", function() {
		const result = findMultiWordKeyphrase( "さらに東海道新幹線の駅構内および列車内に広告を掲出することを。", "東海道新幹線", functionWords );
		expect( result ).toEqual( {
			exactMatchFound: true,
			allWordsFound: true,
			position: 0,
		} );
	} );
	it( "finds an exact match not at the beginning of the title", function() {
		const result = findMultiWordKeyphrase( "東京の東海道新幹線の駅や電車内に広告を掲載する。", "東海道新幹線", functionWords );
		expect( result ).toEqual( {
			exactMatchFound: true,
			allWordsFound: true,
			position: 2,
		} );
	} );
	it( "finds a keyphrase in title when one of the words from the keyphrase occurs before the keyphrase itself", function() {
		const result = findMultiWordKeyphrase( "猫の鳴き声と猫のゴロゴロ", "猫のゴロゴロ", functionWords );
		expect( result ).toEqual( {
			exactMatchFound: true,
			allWordsFound: true,
			position: 3,
		} );
	} );
	it( "returns empty object if the words from the keyphrase are separated by a function word in the title", function() {
		const result = findMultiWordKeyphrase( "東海道を新幹線の駅構内および列車内に広告を掲出することを。", "東海道新幹線", functionWords );
		expect( result ).toEqual( {} );
	} );
	it( "returns empty object if not all words from the keyphrase are in the title", function() {
		const result = findMultiWordKeyphrase( "新幹線", "東海道新幹線", functionWords );
		expect( result ).toEqual( {} );
	} );
} );
