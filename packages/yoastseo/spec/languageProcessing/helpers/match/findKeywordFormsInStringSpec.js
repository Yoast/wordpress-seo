import {
	findWordFormsInString as findKeywordFormsInString,
	findTopicFormsInString } from "../../../../src/languageProcessing/helpers/match/findKeywordFormsInString.js";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

describe( "Test findKeywordFormsInString: checks for the keyword forms are in the supplied string", function() {
	it( "returns the number and the percentage of words matched", function() {
		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			position: -1,
		} );


		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time! I found my lunch!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			position: 19,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 33,
			position: 19,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch! And I found my keys!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 67,
			position: 19,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch! And I found my keys! And I found a keyword!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 3,
			percentWordMatches: 100,
			position: 19,
		} );
	} );

	it( "does not break if the array of word forms is empty", function() {
		expect( findKeywordFormsInString(
			[ [], [] ],
			"It's lunch time!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			position: -1,
		} );
	} );

	it( "does not break if the text is empty", function() {
		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			position: -1,
		} );
	} );

	it( "does not break if the locale is empty", function() {
		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time!"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			position: -1,
		} );
	} );
} );

describe( "Test findTopicFormsInString: checks for the keyword or synonyms forms are in the supplied string", function() {
	it( "returns the number and the percentage of words matched, synonyms deprecated", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			false,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			keyphraseOrSynonym: "keyphrase",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
				synonymsForms: [
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			false,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "keyphrase",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			false,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );
	it( "returns the number and the percentage of words matched, synonyms required", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
				synonymsForms: [
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "keyphrase",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "synonym",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "keyphrase",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "synonym",
		} );

		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [
					[ [ "lunch", "lunches" ], [ "time", "times", "timing" ] ],
					[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
					[ [ "dinner", "dinners" ], [ "moment", "moments" ] ],
				],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "does not break if the synonyms array is empty", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "does not break if the text is empty", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [ [ [ "lunch", "lunches" ], [ "moment", "moments" ] ] ],
			},
			"",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "does not break if the keyphrase forms array is empty", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [],
				synonymsForms: [ [ [ "lunch", "lunches" ], [ "moment", "moments" ] ] ],
			},
			"It's lunch time!",
			true,
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "does not break if the locale is empty", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "lunch", "lunches" ], [ "moment", "moments" ] ],
				synonymsForms: [ [ [ "lunch", "lunches" ], [ "moment", "moments" ] ] ],
			},
			"It's lunch time!",
			true
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	describe( "Test to correctly count Indonesian reduplications", function() {
		it( "matches the singular form buku in the string", function() {
			expect( findTopicFormsInString(
				{
					keyphraseForms: [ [ "buku" ] ],
				},
				"buku-buku & buku-buku & buku.",
				true,
				"id_ID"
			) ).toEqual( {
				countWordMatches: 1,
				percentWordMatches: 100,
				keyphraseOrSynonym: "keyphrase",
			} );
		} );

		it( "doesn't match the singular form buku when only the plural form buku-buku occurs in the string", function() {
			expect( findTopicFormsInString(
				{
					keyphraseForms: [ [ "buku" ] ],
				},
				"buku-buku & buku-buku",
				true,
				"id_ID"
			) ).toEqual( {
				countWordMatches: 0,
				percentWordMatches: 0,
				keyphraseOrSynonym: "keyphrase",
			} );
		} );

		it( "matches the plural form buku-buku in the string", function() {
			expect( findTopicFormsInString(
				{
					keyphraseForms: [ [ "buku-buku" ] ],
				},
				"buku-buku & buku-buku & buku",
				true,
				"id_ID"
			) ).toEqual( {
				countWordMatches: 1,
				percentWordMatches: 100,
				keyphraseOrSynonym: "keyphrase",
			} );
		} );

		it( "doesn't match the plural form buku-buku when only the singular form buku occurs in the string", function() {
			expect( findTopicFormsInString(
				{
					keyphraseForms: [ [ "buku-buku" ] ],
				},
				"buku",
				true,
				"id_ID"
			) ).toEqual( {
				countWordMatches: 0,
				percentWordMatches: 0,
				keyphraseOrSynonym: "keyphrase",
			} );
		} );
	} );
} );

describe( "Test findTopicFormsInString: checks for the keyword or synonyms forms in the supplied string for Japanese " +
	"with a language specific helper to match word in text", function() {
	it( "returns the number and the percentage of words matched, synonyms deprecated", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ] ],
				synonymsForms: [],
			},
			"会える頑張れる待てる",
			false,
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 100,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );
	it( "returns the number and the percentage of words matched (i.e. only one keyphrase form is found in the text), " +
		"synonyms deprecated", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ],
					[ "書く", "書き", "書か", "書け", "書こ", "書い", "書ける", "書かせ", "書かせる", "書かれ", "書かれる", "書こう", "書かっ" ] ],
				synonymsForms: [],
			},
			"会える頑張れる待てる",
			false,
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );
	it( "returns the number and the percentage of words matched, uses synonyms", function() {
		expect( findTopicFormsInString(
			{
				keyphraseForms: [ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ],
					[ "書く", "書き", "書か", "書け", "書こ", "書い", "書ける", "書かせ", "書かせる", "書かれ", "書かれる", "書こう", "書かっ" ] ],
				synonymsForms: [ [ [ "死ぬ", "死に", "死な", "死ね", "死の", "死ん", "死ねる", "死なせ", "死なせる", "死なれ", "死なれる", "死のう" ] ] ],
			},
			"会える頑張れる待てる死ん",
			true,
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 100,
			keyphraseOrSynonym: "synonym",
		} );
	} );
} );

describe( "Test findKeywordFormsInString: checks for the keyword forms in the supplied string for Japanese " +
	"with a language specific helper to match word in text", function() {
	it( "returns the number and the percentage of words matched, and the position of the matches (one-word keyphrase)", function() {
		expect( findKeywordFormsInString(
			[ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ] ],
			"会える頑張れる待てる",
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 100,
			position: 7,
		} );
	} );
	it( "returns the number and the percentage of words matched, " +
		"and the position of the matches (two-word keyphrase, with only one of the words matched)", function() {
		expect( findKeywordFormsInString(
			[ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ],
				[ "書く", "書き", "書か", "書け", "書こ", "書い", "書ける", "書かせ", "書かせる", "書かれ", "書かれる", "書こう", "書かっ" ] ],
			"会える頑張れる待てる",
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
			position: 7,
		} );
	} );
	it( "returns the number and the percentage of words matched, " +
		"and the position of the matches (two-word keyphrase, with both words matched)", function() {
		expect( findKeywordFormsInString(
			[ [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ],
				[ "書く", "書き", "書か", "書け", "書こ", "書い", "書ける", "書かせ", "書かせる", "書かれ", "書かれる", "書こう", "書かっ" ] ],
			"書かせる会える頑張れる待てる死ん",
			"ja",
			matchWordCustomHelper
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 100,
			position: 0,
		} );
	} );
} );
