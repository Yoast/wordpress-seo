import matchTextWithWord from "../../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";


describe( "test for matching Japanese word in the text", function() {
	it( "returns an empty array for the matches if the word is not found in the text", function() {
		const words = matchTextWithWord( "我が家はみんな元気じゃないです。", "日帰り", "日帰り" );

		expect( words ).toEqual( [] );
	} );

	it( "returns an array with the word if the word can be found in the text", function() {
		const words = matchTextWithWord( "日帰りイベントを数回そして5泊6日の国内旅行を予定している。", "日帰り", "日帰り" );

		expect( words ).toEqual( [ "日帰り" ] );
	} );

	it( "returns an array with all the matches of a word found in the text", function() {
		const words = matchTextWithWord( "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな者数。", "者数", "者数" );

		expect( words ).toEqual( [ "者数", "者数" ] );
	} );

	it( "returns an array with all the matches of a word found in the text when the original word was enclosed in double quotes", function() {
		const words = matchTextWithWord( "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな者数。", "者数", "\"者数\"" );

		expect( words ).toEqual( [ "者数", "者数" ] );
	} );
} );
