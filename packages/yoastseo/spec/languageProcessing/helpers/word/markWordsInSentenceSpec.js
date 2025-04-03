import {
	deConstructAnchor,
	markWordsInSentences,
	markWordsInASentence,
	reConstructAnchor } from "../../../../src/languageProcessing/helpers/word/markWordsInSentences";
import Mark from "../../../../src/values/Mark";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

describe( "Adds Yoast marks to specific words in a sentence", function() {
	it( "should add Yoast marks to all instances of specified words in a sentence, except when there is an anchor," +
		" the marking should not be applied to the anchor tag attribute", function() {
		expect( markWordsInSentences(
			[ "picket", "tile" ],
			[ "Introducing Palisades Ceramic Picket Tile — the latest trend in <a href=\"https://www.tileclub.com/collections/ceramic-tile\"" +
			" target=\"_blank\" rel=\"noopener\">ceramic tile</a>!" ],
			"en_EN"
		) ).toEqual( [
			new Mark( {
				marked: "Introducing Palisades Ceramic <yoastmark class='yoast-text-mark'>Picket Tile</yoastmark> — the latest trend in " +
						"<a href=\"https://www.tileclub.com/" +
						"collections/ceramic-tile\" target=\"_blank\" rel=\"noopener\">ceramic " +
						"<yoastmark class='yoast-text-mark'>tile</yoastmark></a>!",
				original: "Introducing Palisades Ceramic Picket Tile — the latest trend in " +
						"<a href=\"https://www.tileclub.com/collections/ceramic-tile\"" +
						" target=\"_blank\" rel=\"noopener\">ceramic tile</a>!" } ),
		]
		);
	} );

	it( "should add Yoast marks to all instances of specified words in a sentence, except when there are multiple anchors," +
		" the marking should not be applied to the anchor tag attribute", function() {
		expect( markWordsInSentences(
			[ "picket", "tile" ],
			[ "Introducing Palisades Ceramic <a href=\"https://www.tileclub.com/ceramic-tile\">Picket Tile</a> — " +
			"the latest trend in <a href=\"https://www.tileclub.com/collections/ceramic-tile\"" +
			" target=\"_blank\" rel=\"noopener\">ceramic tile</a>!" ],
			"en_EN"
		) ).toEqual( [
			new Mark( {
				marked: "Introducing Palisades Ceramic <a href=\"https://www.tileclub.com/ceramic-tile\"><yoastmark class='yoast-text-mark'>" +
						"Picket Tile</yoastmark></a> — the latest trend in " +
						"<a href=\"https://www.tileclub.com/" +
						"collections/ceramic-tile\" target=\"_blank\" rel=\"noopener\">ceramic " +
						"<yoastmark class='yoast-text-mark'>tile</yoastmark></a>!",
				original: "Introducing Palisades Ceramic <a href=\"https://www.tileclub.com/ceramic-tile\">Picket Tile</a> — " +
						"the latest trend in <a href=\"https://www.tileclub.com/collections/ceramic-tile\"" +
						" target=\"_blank\" rel=\"noopener\">ceramic tile</a>!" } ),
		]
		);
	} );

	it( "should add Yoast marks to all instances of specified words in a sentence", function() {
		expect( markWordsInSentences(
			[ "turtle", "hamster" ],
			[ "A cat and a turtle and a hamster.", "A turtle and another turtle." ],
			"en_EN"
		) ).toEqual( [
			new Mark( {
				marked: "A cat and a <yoastmark class='yoast-text-mark'>turtle</yoastmark> " +
					"and a <yoastmark class='yoast-text-mark'>hamster</yoastmark>.",
				original: "A cat and a turtle and a hamster." } ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>turtle</yoastmark> and another <yoastmark class='yoast-text-mark'>turtle</yoastmark>.",
				original: "A turtle and another turtle." } ) ]
		);
	} );

	it( "should generate continuous Yoast marks multiple matches separated by a single space", function() {
		expect( markWordsInSentences(
			[ "turtle", "hamster" ],
			[ "A cat and a turtle hamster.", "A hamster turtle and another turtle." ],
			"en_EN"
		) ).toEqual( [
			new Mark( {
				marked: "A cat and a <yoastmark class='yoast-text-mark'>turtle hamster</yoastmark>.",
				original: "A cat and a turtle hamster." } ),
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>hamster turtle</yoastmark> and another " +
					"<yoastmark class='yoast-text-mark'>turtle</yoastmark>.",
				original: "A hamster turtle and another turtle." } ) ]
		);
	} );

	it( "returns an empty array when the topic is not found in the sentence", function() {
		expect( markWordsInSentences(
			[ "turtle", "hamster" ],
			[ "A cat as a pet.", "A cat is a special pet." ],
			"en_EN"
		) ).toEqual( [] );
	} );

	it( "should add Yoast marks to all instances of specified words in a sentence", function() {
		expect( markWordsInASentence(
			"A cat and a turtle and a hamster.",
			[ "turtle", "hamster" ]
		) ).toEqual( [ new Mark( {
			marked: "A cat and a <yoastmark class='yoast-text-mark'>turtle</yoastmark> " +
					"and a <yoastmark class='yoast-text-mark'>hamster</yoastmark>.",
			original: "A cat and a turtle and a hamster." } ) ] );
	} );

	it( "should find a match of words with different types of apostrophe and add Yoast marks for them", () => {
		let sentences = "The red panda’s coat is mainly red or orange-brown with a black belly and legs.";
		let wordsToMark = [ "red", "panda's" ];
		expect( markWordsInASentence( sentences, wordsToMark, false ) ).toEqual(
			[ new Mark( {
				marked: "The <yoastmark class='yoast-text-mark'>red panda’s</yoastmark> coat is mainly" +
					" <yoastmark class='yoast-text-mark'>red</yoastmark> or orange-brown with a black belly and legs.",
				original: "The red panda’s coat is mainly red or orange-brown with a black belly and legs." } ) ]
		);

		sentences = "The red panda's coat is mainly red or orange-brown with a black belly and legs.";
		wordsToMark = [ "red", "panda’s" ];
		expect( markWordsInASentence( sentences, wordsToMark, false ) ).toEqual(
			[ new Mark( {
				marked: "The <yoastmark class='yoast-text-mark'>red panda's</yoastmark> coat is mainly" +
					" <yoastmark class='yoast-text-mark'>red</yoastmark> or orange-brown with a black belly and legs.",
				original: "The red panda's coat is mainly red or orange-brown with a black belly and legs." } ) ]
		);

		sentences = "« The ‹black-footed› cat has tawny fur that is entirely covered with black spots. »";
		wordsToMark = [ "black-footed", "cat" ];
		expect( markWordsInASentence( sentences, wordsToMark, false ) ).toEqual(
			[ new Mark( {
				marked: "« The ‹<yoastmark class='yoast-text-mark'>black-footed</yoastmark>› <yoastmark class='yoast-text-mark'>cat</yoastmark> " +
					"has tawny fur that is entirely covered with black spots. »",
				original: "« The ‹black-footed› cat has tawny fur that is entirely covered with black spots. »" } ) ]
		);

		sentences = "The fo'c'sle is the upper deck of a sailing ship forward of the foremast.";
		wordsToMark = [ "fo’c’sle" ];
		expect( markWordsInASentence( sentences, wordsToMark, false ) ).toEqual(
			[ new Mark( {
				marked: "The <yoastmark class='yoast-text-mark'>fo'c'sle</yoastmark> is the upper deck of a sailing ship forward of the foremast.",
				original: "The fo'c'sle is the upper deck of a sailing ship forward of the foremast." } ) ]
		);
	} );
} );

describe( "Adds Yoast marks to specific words in a sentence for languages with custom helper to match words", function() {
	// Japanese has the custom helper to match words.
	it( "should add Yoast marks to all instances of specified words in a sentence", function() {
		expect( markWordsInSentences(
			[ "黒", "長袖", "マキシドレス" ],
			[ "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。", "しかし、それは在庫切れでしたマキシドレス。" ],
			"ja",
			matchWordCustomHelper
		) ).toEqual( [
			new Mark( {
				marked: "彼女はオンラインストアで<yoastmark class='yoast-text-mark'>黒</yoastmark>の<yoastmark class='yoast-text-mark'>長袖</yoastmark>" +
					"<yoastmark class='yoast-text-mark'>マキシドレス</yoastmark>を購入したかった。",
				original: "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。" } ),
			new Mark( {
				marked: "しかし、それは在庫切れでした<yoastmark class='yoast-text-mark'>マキシドレス</yoastmark>。",
				original: "しかし、それは在庫切れでしたマキシドレス。" } ) ]
		);
	} );

	it( "should still add Yoast marks to all instances of specified words in a sentence even when the word is enclosed in double quotes", function() {
		expect( markWordsInSentences(
			[ "『小さい花の刺繍』" ],
			[ "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。", "小さい花の刺繍しかし、それは在庫切れでしたマキシドレス。" ],
			"ja",
			matchWordCustomHelper
		) ).toEqual( [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>小さい花の刺繍</yoastmark>しかし、それは在庫切れでしたマキシドレス。",
				original: "小さい花の刺繍しかし、それは在庫切れでしたマキシドレス。" } ),
		]
		);
	} );

	it( "should still add Yoast marks to all instances of specified words in a sentence even when " +
		"the keyword is enclosed in double quotes and the instances in the text is followed by a fullstop", function() {
		expect( markWordsInSentences(
			[ "『小さい花の刺繍』" ],
			[ "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。", "しかし、それは在庫切れでしたマキシドレス。", "小さい花の刺繍。" ],
			"ja",
			matchWordCustomHelper
		) ).toEqual( [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>小さい花の刺繍</yoastmark>。",
				original: "小さい花の刺繍。" } ),
		]
		);
	} );

	it( "returns an empty array when the topic is not found in the sentence", function() {
		expect( markWordsInSentences(
			[ "書き", "甘い香ら" ],
			[ "私はペットとして2匹の猫を飼っています。", "どちらもとても可愛くて甘い猫で、猫の餌を食べるのが大好きです。" ],
			"ja",
			matchWordCustomHelper
		) ).toEqual( [] );
	} );
} );

describe( "test the deconstructAnchor and reconstructAnchor helper", () => {
	it( "correctly deconstructs and reconstructs an anchor", () => {
		const testAnchor = "<a href=\"https://yoast.com\">This is yoast.</a>";
		const deconstructedAnchor = deConstructAnchor( testAnchor );

		expect( deconstructedAnchor ).toEqual( {
			openTag: "<a href=\"https://yoast.com\">",
			content: "This is yoast.",
		} );

		const reconstructedAnchor = reConstructAnchor( deconstructedAnchor.openTag, deconstructedAnchor.content );
		expect( reconstructedAnchor ).toEqual( testAnchor );
	} );

	it( "correctly deconstructs and reconstructs an anchor that contains html elements itself", () => {
		const testAnchor = "<a href=\"https://yoast.com\">This <i>is</i> <b>yoast</b>.</a>";
		const deconstructedAnchor = deConstructAnchor( testAnchor );

		expect( deconstructedAnchor ).toEqual( {
			openTag: "<a href=\"https://yoast.com\">",
			content: "This <i>is</i> <b>yoast</b>.",
		} );

		const reconstructedAnchor = reConstructAnchor( deconstructedAnchor.openTag, deconstructedAnchor.content );
		expect( reconstructedAnchor ).toEqual( testAnchor );
	} );

	it( "correctly deconstructs and reconstructs an anchor if does not contain content", () => {
		// Unrealistic Scenario. But protects against the bug that is solved in this PR:
		// https://github.com/Yoast/wordpress-seo/pull/19373
		const testAnchor = "<a href=\"https://yoast.com\"></a>";
		const deconstructedAnchor = deConstructAnchor( testAnchor );

		expect( deconstructedAnchor ).toEqual( {
			openTag: "<a href=\"https://yoast.com\">",
			content: "",
		} );

		const reconstructedAnchor = reConstructAnchor( deconstructedAnchor.openTag, deconstructedAnchor.content );
		expect( reconstructedAnchor ).toEqual( testAnchor );
	} );

	it( "correctly deconstructs and reconstructs an anchor if content contains a newline", () => {
		// Unrealistic Scenario. But protects against the bug that is solved in this PR:
		// https://github.com/Yoast/wordpress-seo/pull/19373
		const testAnchor = "<a href=\"https://yoast.com\">This is a line.\nAnd this is a line.</a>";
		const deconstructedAnchor = deConstructAnchor( testAnchor );

		expect( deconstructedAnchor ).toEqual( {
			openTag: "<a href=\"https://yoast.com\">",
			content: "This is a line.\nAnd this is a line.",
		} );

		const reconstructedAnchor = reConstructAnchor( deconstructedAnchor.openTag, deconstructedAnchor.content );
		expect( reconstructedAnchor ).toEqual( testAnchor );
	} );
} );


