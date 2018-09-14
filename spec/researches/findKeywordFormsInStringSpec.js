const findKeywordFormsInString = require( "../../src/researches/findKeywordFormsInString.js" ).findWordFormsInString;
const findTopicFormsInString = require( "../../src/researches/findKeywordFormsInString.js" ).findTopicFormsInString;

describe( "Test findKeywordFormsInString: checks for the keyword forms are in the supplied string", function() {
	it( "returns the number and the percentage of words matched", function() {
		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
		} );


		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time! I found my lunch!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 50,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 1,
			percentWordMatches: 33,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch! And I found my keys!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 2,
			percentWordMatches: 67,
		} );

		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ], [ "key", "keys" ] ],
			"It's lunch time! I found my lunch! And I found my keys! And I found a keyword!",
			"en_EN"
		) ).toEqual( {
			countWordMatches: 3,
			percentWordMatches: 100,
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
		} );
	} );

	it( "does not break if the locale is empty", function() {
		expect( findKeywordFormsInString(
			[ [ "keyword", "keywords" ], [ "find", "finds", "found", "finding" ] ],
			"It's lunch time!"
		) ).toEqual( {
			countWordMatches: 0,
			percentWordMatches: 0,
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
} );
