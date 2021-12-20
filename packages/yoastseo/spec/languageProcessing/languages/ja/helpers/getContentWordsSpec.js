import { enableFeatures } from "@yoast/feature-flag";
import getContentWords from "../../../../../src/languageProcessing/languages/ja/helpers/getContentWords";

describe( "test for getting the Japanese content words", function() {
	it( "returns an empty array if the text is empty", function() {
		const words = getContentWords( "" );

		expect( words ).toEqual( [] );
	} );
	it( "returns an array of content words from Japanese text that has function words in it", function() {
		let words = "日帰りイベントを数回そして5泊6日の国内旅行を予定している。";
		expect( getContentWords( words ) ).toEqual( [ "日帰り", "イベント", "数回", "そし", "5", "泊", "6", "国内", "旅行", "予定" ] );

		words = "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな。";
		expect( getContentWords( words ) ).toEqual( [ "夏休", "明け", "感染", "者数", "抑え", "だけど" ] );
	} );
	it( "returns an array of content words from Japanese text in which one of the words ends in -じゃ", function() {
		const words = getContentWords( "我が家はみんな元気じゃないです。" );

		expect( words ).toEqual( [ "我", "家", "元気" ] );
	} );
} );
