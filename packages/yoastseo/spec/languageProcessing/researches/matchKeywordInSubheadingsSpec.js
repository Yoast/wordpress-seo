/* eslint-disable capitalized-comments */
import matchKeywordInSubheadings from "../../../src/languageProcessing/researches/matchKeywordInSubheadings";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";

describe( "Matching keyphrase in subheadings", () => {
	it( "matches only h2 and h3 subheadings", () => {
		const paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>",
			{}
		);
		const result = matchKeywordInSubheadings( paper, new Researcher( paper ) );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
	} );

	it( "matching is stricter with languages that do not support function words", () => {
		// There is no function word support for Afrikaans.
		const paper = new Paper( "<h2>So ’n groot hond</h2>", {
			keyword: "So ’n groot huis",
			locale: "af",
		} );

		// All the words should match and since hond !== huis the expected result is 0.
		expect( matchKeywordInSubheadings( paper, new DefaultResearcher( paper ) ).matches ).toBe( 0 );

		// There is function word support for English.
		paper._attributes.locale = "en_US";
		// More than 50% should match. With 1 of the 4 words mismatching the expected result is 1.
		expect( matchKeywordInSubheadings( paper, new Researcher( paper ) ).matches ).toBe( 1 );
	} );

	it( "tests for a case when there is no subheading in the text", () => {
		const paper = new Paper( "A beautiful tortie cat.", {} );
		const result = matchKeywordInSubheadings( paper, new Researcher( paper ) );
		expect( result.count ).toBe( 0 );
	} );
} );

/**
 * Mocks Japanese Researcher.
 * @param {Array} keyphraseForms        The morphological forms of the kyphrase to be added to the researcher.
 * @param {Array} synonymsForms         The morphological forms of the synonyms to be added to the researcher.
 * @param {function} matchWords         A helper needed for the assesment.
 * @param {Object} functionWordsConfig  Function words config needed for the assesment.
 * @returns {Researcher} The mock researcher with added morphological forms and custom helper.
const buildJapaneseMockResearcher = function( keyphraseForms, synonymsForms, matchWords, functionWordsConfig ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
			synonymsForms: synonymsForms,
		},
	},
	true,
	true,
	{
		functionWords: functionWordsConfig,
	},
	{
		matchWordCustomHelper: matchWords,
	} );
};*/
/*

describe( "Matching keyphrase in subheadings with custom helper to match word in text", () => {
	// The Japanese researcher has a custom helper to match word in text.
	it( "matches only h2 and h3 subheadings, with no keyphrase or synonyms set", () => {
		const paper = new Paper(
			"<h2>猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>長い髪の猫</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>" +
			"<h4>メインクーン</h4><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>",
			{}
		);
		const keyphraseForms = [];
		const synonymForms = [];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
		expect( result.percentReflectingTopic ).toBe( 0 );
	} );

	it( "matches keyphrase with function words in subheading, no synonym is set", () => {
		const paper = new Paper( "<h2>長いコートを持っている猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>短い髪の猫の品種</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>", {
			keyword: "猫の品種",
			locale: "ja",
		} );
		const keyphraseForms = [ [ "猫" ], [ "品種" ] ];
		const synonymForms = [];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		expect( result.matches ).toBe( 2 );
		expect( result.percentReflectingTopic ).toBe( 100 );
	} );

	it( "matches keyphrase and synonym in subheading, where the synonym has better result", () => {
		const paper = new Paper( "<h2>長いコートを持っている猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>短い髪の猫の品種</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>" +
			"<h3>ぶち猫の種類</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>", {
			keyword: "猫の品種",
			synonyms: "猫の品種",
			locale: "ja",
		} );
		const keyphraseForms = [ [ "猫" ], [ "種類" ] ];
		const synonymForms = [ [ [ "猫" ], [ "品種" ] ] ];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		expect( result.matches ).toBe( 2 );
		expect( result.percentReflectingTopic ).toBe( 66.66666666666666 );
	} );

	it( "matches keyphrase and synonym in subheading, where the keyphrase has better result", () => {
		const paper = new Paper( "<h2>さまざまな低照度植物</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>サンセベリア植物</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>", {
			keyword: "低照度植物",
			synonyms: "簡単な植物",
			locale: "ja",
		} );
		const keyphraseForms = [ [ "低照" ], [ "度植" ] ];
		const synonymForms = [ [ [ "簡単" ], [ "植物" ] ] ];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 50 );
	} );

	it( "matches three word-long keyphrase in subheading, where two words of the keyphrase are found" +
		" in the subheading (67% percentWordMatches)", () => {
		const paper = new Paper( "<h2>猫の品種は国の出身に基づいています</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>サンセベリア植物</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>", {
			keyword: "猫の品種の種類",
			locale: "ja",
		} );
		const keyphraseForms = [ [ "猫" ], [ "品種" ], [ "種類" ] ];
		const synonymForms = [];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		expect( result.matches ).toBe( 1 );
		expect( result.percentReflectingTopic ).toBe( 50 );
	} );

	it( "matches three word-long keyphrase in subheading, where only one word of the keyphrase is found" +
		" in the subheading (33% percentWordMatches)", () => {
		const paper = new Paper( "<h2>あなたが望む最も忠実な猫</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>", {
			keyword: "猫の品種の種類",
			locale: "ja",
		} );
		const keyphraseForms = [ [ "猫" ], [ "品種" ], [ "種類" ] ];
		const synonymForms = [];
		const mockResearcher = buildJapaneseMockResearcher( keyphraseForms, synonymForms, matchWordsHelper, japaneseFunctionWords );
		const result = matchKeywordInSubheadings( paper, mockResearcher );

		expect( result.matches ).toBe( 0 );
		expect( result.percentReflectingTopic ).toBe( 0 );
	} );
} );
*/
