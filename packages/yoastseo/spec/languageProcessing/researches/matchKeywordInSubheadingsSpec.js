import matchKeywordInSubheadings from "../../../src/languageProcessing/researches/matchKeywordInSubheadings";
import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import buildTree from "../../specHelpers/parse/buildTree";
import { Mark } from "../../../src/values";
import getMorphologyData from "../../specHelpers/getMorphologyData";
const morphologyData = getMorphologyData( "en" );

describe( "Matching keyphrase in subheadings: English", () => {
	let researcher, paper;
	beforeEach( () => {
		researcher = new EnglishResearcher( paper );
	} );
	it( "matches only h2 and h3 subheadings", () => {
		paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>",
			{}
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
	} );

	it( "tests for a case when there is no subheading in the text", () => {
		paper = new Paper( "A beautiful tortie cat.", {} );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 0 );
	} );

	it( "should not match text within script tags", () => {
		paper = new Paper( "<h2 class=\"wp-block-heading\" id=\"h-what-is-a-console-log\">" +
			"What is a <script>console.log( \"calico cat?\" )</script></h2>A beautiful dog.", { keyword: "calico cat" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "should not match text that is also a shortcode", function() {
		paper = new Paper( "<h2 class=\"wp-block-heading\" id=\"h-what-is-a-console-log\">" +
			"What is a [shortcode]</h2>A beautiful dog.", { keyword: "shortcode", shortcodes: [ "shortcode" ] } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "should not match text within heading attributes", () => {
		paper = new Paper( "<h2 class=\"wp-block-heading\" id=\"h-what-is-a-console-log-calico-cat\">" +
			"What is a <script>console.log( \"corgi dog?\" )</script></h2>A beautiful dog.", { keyword: "calico cat" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "does not count keyphrase instances inside an element we want to exclude from the analysis", () => {
		paper = new Paper( "<h2>Hello<code>code</code></h2>", { keyword: "code" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "matches keyphrase with function words in subheading, no synonym is set", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper into cats!</h3><p>More text here.</p>",
		{ keyword: "Everyone's favorite cats", locale: "en_US" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 2 );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
		expect( result.matches.markings ).toEqual( [
			new Mark(
				{
					marked: "Everyone's <yoastmark class='yoast-text-mark'>favorite cats</yoastmark>",
					original: "Everyone's favorite cats",
					position: {
						attributeId: "",
						clientId: "",
						endOffset: 28,
						endOffsetBlock: 24,
						isFirstSection: false,
						startOffset: 15,
						startOffsetBlock: 11 },
				} ),
		] );
	} );

	it( "returns the result for synonyms when the synonym has better result than the keyphrase", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper everyone's favorite feline!</h3><p>More text here.</p>" +
			"<h2>A feline is everyone's favorite</h2><p>So much more text her.</p><h3>More subheading</h3>",
		{ keyword: "Everyone's favorite cats", synonyms: "Everyone's favorite feline", locale: "en_US" } );
		researcher.setPaper( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 4 );
		expect( result.matches.numberOfSubheadings ).toBe( 3 );
		expect( result.matches.markings ).toEqual( [
			new Mark( {
				marked: "Everyone's <yoastmark class='yoast-text-mark'>favorite cats</yoastmark>",
				original: "Everyone's favorite cats",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 28,
					endOffsetBlock: 24,
					isFirstSection: false,
					startOffset: 15,
					startOffsetBlock: 11,
				},
			} ),
			new Mark( {
				marked: "Delve deeper everyone's <yoastmark class='yoast-text-mark'>favorite feline</yoastmark>!",
				original: "Delve deeper everyone's favorite feline!",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 127,
					endOffsetBlock: 39,
					isFirstSection: false,
					startOffset: 112,
					startOffsetBlock: 24,
				},
			} ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>feline</yoastmark> is everyone's <yoastmark class='yoast-text-mark'>favorite</yoastmark>",
				original: "A feline is everyone's favorite",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 167,
					endOffsetBlock: 8,
					isFirstSection: false,
					startOffset: 161,
					startOffsetBlock: 2,
				},
			} ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>feline</yoastmark> is everyone's <yoastmark class='yoast-text-mark'>favorite</yoastmark>",
				original: "A feline is everyone's favorite",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 190,
					endOffsetBlock: 31,
					isFirstSection: false,
					startOffset: 182,
					startOffsetBlock: 23,
				},
			} ),
		] );
	} );

	it( "returns the result for keyphrase when the keyphrase has better result than the synonym", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper into everyone's favorite cats!</h3><p>More text here.</p>" +
			"<h2>A feline is everyone's favorite</h2><p>So much more text her.</p><h3>More subheading</h3>",
		{ keyword: "Everyone's favorite cats", synonyms: "Everyone's favorite feline, cute cats", locale: "en_US" } );
		researcher.setPaper( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 4 );
		expect( result.matches.numberOfSubheadings ).toBe( 3 );
		expect( result.matches.markings ).toEqual( [
			new Mark( {
				marked: "Everyone's <yoastmark class='yoast-text-mark'>favorite cats</yoastmark>",
				original: "Everyone's favorite cats",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 28,
					endOffsetBlock: 24,
					isFirstSection: false,
					startOffset: 15,
					startOffsetBlock: 11,
				},
			} ),
			new Mark( {
				marked: "Delve deeper into everyone's <yoastmark class='yoast-text-mark'>favorite cats</yoastmark>!",
				original: "Delve deeper into everyone's favorite cats!",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 130,
					endOffsetBlock: 42,
					isFirstSection: false,
					startOffset: 117,
					startOffsetBlock: 29,
				},
			} ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>feline</yoastmark> is everyone's <yoastmark class='yoast-text-mark'>favorite</yoastmark>",
				original: "A feline is everyone's favorite",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 170,
					endOffsetBlock: 8,
					isFirstSection: false,
					startOffset: 164,
					startOffsetBlock: 2,
				},
			} ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>feline</yoastmark> is everyone's <yoastmark class='yoast-text-mark'>favorite</yoastmark>",
				original: "A feline is everyone's favorite",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 193,
					endOffsetBlock: 31,
					isFirstSection: false,
					startOffset: 185,
					startOffsetBlock: 23,
				},
			} ),
		] );
	} );

	it( "matches keyphrase in subheading with different word forms, when morphology data is available", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper into cat's favorites!</h3><p>More text here.</p>",
		{ keyword: "Everyone's favorite cats", locale: "en_US" } );
		researcher.setPaper( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 2 );
		expect( result.matches.numberOfSubheadings ).toBe( 2 );
	} );

	it( "matches the keyphrase found in different sentences in the subheadings", () => {
		paper = new Paper( "<h2>Wants to be happy? Adopt a cat!</h2><p>First alinea, not much text for some reason.</p>", { keyword: "happy cat", locale: "en_US" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
		expect( result.matches.markings ).toEqual( [
			new Mark( {
				marked: "Wants to be <yoastmark class='yoast-text-mark'>happy</yoastmark>?",
				original: "Wants to be happy?",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 21,
					endOffsetBlock: 17,
					isFirstSection: false,
					startOffset: 16,
					startOffsetBlock: 12,
				},
			} ),
			new Mark( {
				marked: " Adopt a <yoastmark class='yoast-text-mark'>cat</yoastmark>!",
				original: " Adopt a cat!",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 34,
					endOffsetBlock: 30,
					isFirstSection: false,
					startOffset: 31,
					startOffsetBlock: 27,
				},
			} ),
		] );
	} );

	it( "does not overcount when the same keyphrase word matches in multiple sentences", () => {
		// The 2-word keyphrase "cat fish" has only "cat" present in the heading; "fish" is absent.
		// The heading contains two sentences, and "cat" appears in both.
		// matchWordFormsInSentences tracks matched word-form indices via a Set, so "cat" (index 0)
		// is only counted once across both sentences. matchCount = Set.size = 1 (only "cat"),
		// giving percentWordMatches = round(1/2 * 100) = 50% — correctly below the >50% threshold.
		// The heading should NOT be counted as reflecting the topic because "fish" is never present.
		paper = new Paper(
			"<h2>My cat is fluffy. The cat sat.</h2><p>Some body text here.</p>",
			{ keyword: "cat fish", locale: "en_US" }
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		expect( result.count ).toBe( 1 );
		// "cat" appears in two sentences but must only be counted once; "fish" is absent.
		// So only 1 of 2 topic words is matched → 50% — not above the >50% threshold → 0 subheadings.
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "only marks matched topics within each sentence's position range when keyphrase words are in different sentences", () => {
		// This test verifies that matched topics are filtered to only include those within each sentence's source code range.
		// The subheading has two sentences: "Love your dog." and "Feed your cat!"
		// Keyphrase "dog cat" has words in different sentences, so each sentence should only have its own match marked.
		paper = new Paper(
			"<h2>Love your dog. Feed your cat!</h2><p>Some body text here.</p>",
			{ keyword: "dog cat", locale: "en_US" }
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
		// Verify that each sentence only contains its own matched word, not words from other sentences.
		expect( result.matches.markings ).toEqual( [
			new Mark( {
				marked: "Love your <yoastmark class='yoast-text-mark'>dog</yoastmark>.",
				original: "Love your dog.",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 17,
					endOffsetBlock: 13,
					isFirstSection: false,
					startOffset: 14,
					startOffsetBlock: 10,
				},
			} ),
			new Mark( {
				marked: " Feed your <yoastmark class='yoast-text-mark'>cat</yoastmark>!",
				original: " Feed your cat!",
				position: {
					attributeId: "",
					clientId: "",
					endOffset: 32,
					endOffsetBlock: 28,
					isFirstSection: false,
					startOffset: 29,
					startOffsetBlock: 25,
				},
			} ),
		] );
	} );

	it( "also returns the text on which the analysis is done and its length", () => {
		paper = new Paper(
			"<h2>Start of post</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Delve deeper!</h3><p>More text here.</p>" +
			"<h4>Even more?</h4><p>Yes, even more.</p>" +
			"<code>This is code</code>",
			{ keyword: "Delve deeper", locale: "en_US" }
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.textLength ).toBe( 21 );
	} );
} );

describe( "Matching keyphrase in subheadings: exact match", () => {
	let researcher, paper;
	beforeEach( () => {
		researcher = new EnglishResearcher( paper );
	} );
	it( "matches only exact matches of the keyphrase in subheadings", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Cats are everyone's favorite!</h3><p>More text here.</p>",
		{ keyword: "\"Everyone's favorite cats\"", locale: "en_US" } );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 2 );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
	} );
	it( "should not match keyphrase with different word forms in subheadings", () => {
		paper = new Paper( "<h2>Everyone's favorite cats</h2><p>First alinea, not much text for some reason.</p>" +
			"<h3>Cats are everyone's favorite!</h3><p>More text here.</p>",
		{ keyword: "\"Everyone's favorite cat\"", locale: "en_US" } );
		researcher.setPaper( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 2 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );
} );

describe( "Matching keyphrase in subheadings with custom helper to match word in text: languages without function words support", () => {
	it( "matching is stricter with languages that do not support function words", () => {
		// There is no function word support for Afrikaans.
		const paper = new Paper( "<h2>So ’n groot hond</h2>", {
			keyword: "So ’n groot huis",
			locale: "af",
		} );

		const defaultResearcher = new DefaultResearcher( paper );
		buildTree( paper, defaultResearcher );
		// All the words should match, and since hond !== huis the expected result is 0.
		expect( matchKeywordInSubheadings( paper, defaultResearcher ).matches.numberOfSubheadings ).toBe( 0 );

		// There is function word support for English.
		paper._attributes.locale = "en_US";
		const englishResearcher = new EnglishResearcher( paper );
		buildTree( paper, englishResearcher );
		// More than 50% should match. With 1 of the 4 words mismatching, the expected result is 1.
		expect( matchKeywordInSubheadings( paper, englishResearcher ).matches.numberOfSubheadings ).toBe( 1 );
	} );
} );

describe( "Matching keyphrase in subheadings with custom helper to match word in text", () => {
	let researcher, paper;
	beforeEach( () => {
		researcher = new JapaneseResearcher( paper );
	} );
	// The Japanese researcher has a custom helper to match word in text.
	it( "matches only h2 and h3 subheadings, with no keyphrase or synonyms set", () => {
		paper = new Paper(
			"<h2>猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>長い髪の猫</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>" +
			"<h4>メインクーン</h4><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>",
			{ keyword: "", synonyms: "" }
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		// Would be 3 if the h4 was counted too.
		expect( result.count ).toBe( 2 );
	} );

	it( "matches keyphrase with function words in subheading, no synonym is set", () => {
		paper = new Paper( "<h2>長いコートを持っている猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>短い髪の猫の品種</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>",
		{
			// KeyphraseForms [ [ "猫" ], [ "品種" ] ];
			keyword: "猫の品種",
			locale: "ja",
		} );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		expect( result.matches.numberOfSubheadings ).toBe( 2 );
	} );

	it( "matches keyphrase and synonym in subheading, where the synonym has better result", () => {
		paper = new Paper( "<h2>長いコートを持っている猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>短い髪の猫の品種</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>" +
			"<h3>ぶち猫の種類</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>",
		{
			// KeyphraseForms: [ [ "猫" ], [ "種類" ] ]
			keyword: "猫の品種",
			// SynonymForms: [ [ [ "猫" ], [ "品種" ] ] ]
			synonyms: "猫の品種",
			locale: "ja",
		} );

		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.matches.numberOfSubheadings ).toBe( 2 );
	} );

	it( "matches keyphrase and synonym in subheading, where the keyphrase has better result", () => {
		paper = new Paper( "<h2>さまざまな低照度植物</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>サンセベリア植物</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>",
		{
			// KeyphraseForms: [ [ "低照" ], [ "度植" ] ]
			keyword: "低照度植物",
			// SynonymForms: [ [ [ "簡単" ], [ "植物" ] ] ]
			synonyms: "簡単な植物",
			locale: "ja",
		} );

		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
	} );

	it( "matches three word-long keyphrase in subheading, where two words of the keyphrase are found" +
		" in the subheading (67% percentWordMatches)", () => {
		paper = new Paper( "<h2>猫の品種は国の出身に基づいています</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>サンセベリア植物</h3><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>",
		{
			// KeyphraseForms: [ [ "猫" ], [ "品種" ], [ "種類" ] ]
			keyword: "猫の品種の種類",
			locale: "ja",
		} );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 2 );
		expect( result.matches.numberOfSubheadings ).toBe( 1 );
	} );

	it( "matches three word-long keyphrase in subheading, where only one word of the keyphrase is found" +
		" in the subheading (33% percentWordMatches)", () => {
		paper = new Paper( "<h2>あなたが望む最も忠実な猫</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>",
			{
				// KeyphraseForms: [ [ "猫" ], [ "品種" ], [ "種類" ] ]
				keyword: "猫の品種の種類",
				locale: "ja",
			} );

		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );
		expect( result.count ).toBe( 1 );
		expect( result.matches.numberOfSubheadings ).toBe( 0 );
	} );

	it( "also returns the text on which the analysis is done and its length", () => {
		paper = new Paper(
			"<h2>猫の品種</h2><p>覧ゆくば義界ゅ在遊カヨミ仙交ぼそはク迷男質よ質成シロヘキ街意ヘラケノ分8真めけは者横れげみ暮双ルそりか連跡弟宣獲析毛はそぐ。</p>" +
			"<h3>長い髪の猫</h3><p>国イヌチレ成授帳ぴゃ併実ムフ覧勇んド写側部実ヘ草幅能カ著焼タミイル人図ワロ読環ヲヌ新上ふげ入持ヌカクハ氏負ロカテネ遂当報えがへそ選示リー掲13因地余ルどく。</p>" +
			"<h4>メインクーン</h4><p>会せルもよ結相ケスミヤ彩壊むは裁者りづは特派つラ出指提けぴ今紀シイエ源4京テヌ写府レリび状右落博みえごす。</p>" +
			"<code>This is code</code>",
			{ keyword: "猫の品種", locale: "ja" }
		);
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		const result = matchKeywordInSubheadings( paper, researcher );

		expect( result.textLength ).toBe( 205 );
	} );
} );
