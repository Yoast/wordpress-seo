import { markWordsInSentences } from "../../src/stringProcessing/markWordsInSentences";
import Mark from "../../src/values/Mark";

describe( "Adds Yoast marks to specific words in a sentence", function() {
	it( "should add Yoast marks to all instances of specified words in a sentence", function() {
		expect( markWordsInSentences(
			[ "turtle", "hamster" ],
			[ "A cat and a turtle and a hamster.", "A turtle and another turtle." ],
			"en_EN"
		) ).toEqual( [
			new Mark( { marked: "A cat and a <yoastmark class='yoast-text-mark'>turtle</yoastmark> and a <yoastmark class='yoast-text-mark'>hamster</yoastmark>.",
				original: "A cat and a turtle and a hamster." } ),
			new Mark( { marked: "A <yoastmark class='yoast-text-mark'>turtle</yoastmark> and another <yoastmark class='yoast-text-mark'>turtle</yoastmark>.",
				original: "A turtle and another turtle." } ) ]
		);
	} );

	it( "should generate continuous Yoast marks multiple matches separated by a single space", function() {
		expect( markWordsInSentences(
			[ "turtle", "hamster" ],
			[ "A cat and a turtle hamster.", "A hamster turtle and another turtle." ],
			"en_EN"
		) ).toEqual( [
			new Mark( { marked: "A cat and a <yoastmark class='yoast-text-mark'>turtle hamster</yoastmark>.",
				original: "A cat and a turtle hamster." } ),
			new Mark( { marked: "A <yoastmark class='yoast-text-mark'>hamster turtle</yoastmark> and another <yoastmark class='yoast-text-mark'>turtle</yoastmark>.",
				original: "A hamster turtle and another turtle." } ) ]
		);
	} );
} );
