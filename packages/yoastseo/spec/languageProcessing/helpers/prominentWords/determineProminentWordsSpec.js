import ProminentWord from "../../../../src/languageProcessing/values/ProminentWord";
import {
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	filterProminentWords,
	collapseProminentWordsOnStem,
	sortProminentWords,
	retrieveAbbreviations,
} from "../../../../src/languageProcessing/helpers/prominentWords/determineProminentWords";
import baseStemmer from "../../../../src/languageProcessing/helpers/morphology/baseStemmer";
import getWordsCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/getWords";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

describe( "retrieveAbbreviations", function() {
	it( "makes a list of all abbreviations from the input text", function() {
		const input = "A CTA lowercase CTR WWF SEO US YOAST camelCase PascalCase";
		const expected = [
			"cta",
			"ctr",
			"wwf",
			"seo",
			"us",
		];

		const actual = retrieveAbbreviations( input );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "filterProminentWords", function() {
	it( "removes words with one occurrence (for internal linking)", function() {
		const input = [
			new ProminentWord( "irrelevant", "irrelevant", 1 ),
			new ProminentWord( "occurrence", "occurrence", 2 ),
		];
		const expected = [
			new ProminentWord( "occurrence", "occurrence", 2 ),
		];

		const actual = filterProminentWords( input, 2 );

		expect( actual ).toEqual( expected );
	} );

	it( "removes words with less than 5 occurrences (for insights)", function() {
		const input = [
			new ProminentWord( "irrelevant", "irrelevant", 4 ),
			new ProminentWord( "occurrence", "occurrence", 5 ),
			new ProminentWord( "here", "here", 6 ),
		];
		const expected = [
			new ProminentWord( "occurrence", "occurrence", 5 ),
			new ProminentWord( "here", "here", 6 ),
		];

		const actual = filterProminentWords( input, 5 );

		expect( actual ).toEqual( expected );
	} );

	it( "removes numbers and punctuation", function() {
		const input = [
			new ProminentWord( "*", "*", 2 ),
			new ProminentWord( "/)*8%$", "/)*8%$", 2 ),
			new ProminentWord( "100", "100", 2 ),
		];
		const expected = [];

		const actual = filterProminentWords( input );

		expect( actual ).toEqual( expected );
	} );

	it( "removes numbers and punctuation regardless of number of occurrences and the minimalNumberOfOccurrences parameter", function() {
		const input = [
			new ProminentWord( "*", "*", 6 ),
			new ProminentWord( "/)*8%$", "/)*8%$", 1 ),
			new ProminentWord( "100", "100", 2 ),
		];
		const expected = [];

		const actual = filterProminentWords( input, 3 );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "sortProminentWords", function() {
	it( "sorts based on number of occurrences", function() {
		const combination1 = new ProminentWord( "word1", "word1", 2 );
		const combination2 = new ProminentWord( "word2", "word2", 3 );

		const output = [ combination1, combination2 ];
		const initial = [ combination1, combination2 ];
		const reversed = [ combination2, combination1 ];

		sortProminentWords( output );

		expect( output ).toEqual( reversed );

		combination1.setOccurrences( combination1.getOccurrences() + 2 );
		sortProminentWords( output );
		expect( output ).toEqual( initial );

		combination2.setOccurrences( combination2.getOccurrences() + 2 );
		sortProminentWords( output );
		expect( output ).toEqual( reversed );
	} );

	it( "sorts alphabetically if the relevance is tied", function() {
		const combination1 = new ProminentWord( "wordA", "wordA", 2 );
		const combination2 = new ProminentWord( "wordB", "wordB", 2 );
		const combination3 = new ProminentWord( "wordC", "wordC", 3 );

		const output = [ combination1, combination2, combination3 ];
		const sorted = [ combination3, combination1, combination2 ];

		sortProminentWords( output );

		expect( output ).toEqual( sorted );
	} );

	it( "sorts alphabetically even if abbreviations are in the list", function() {
		const combination1 = new ProminentWord( "wordA", "wordA", 2 );
		const combination2 = new ProminentWord( "WORDB", "wordB", 2 );
		const combination3 = new ProminentWord( "wordC", "wordC", 3 );
		const combination4 = new ProminentWord( "wordB", "wordB", 2 );

		const output = [ combination1, combination2, combination3, combination4 ];
		const sorted = [ combination3, combination1, combination2, combination4 ];

		sortProminentWords( output );

		expect( output ).toEqual( sorted );
	} );

	it( "preserves the correct alphabetical order: this case is improbable, added for the sake of test coverage", function() {
		const combination1 = new ProminentWord( "word", "word", 2 );
		const combination2 = new ProminentWord( "word", "word", 2 );

		const output = [ combination1, combination2 ];
		const sorted = [ combination1, combination2 ];

		sortProminentWords( output );

		expect( output ).toEqual( sorted );
	} );
} );

describe( "collapseProminentWordsOnStem collapses over duplicates by stem", function() {
	it( "does not break for an empty input array", function() {
		expect( collapseProminentWordsOnStem( [] ) ).toEqual( [] );
	} );

	it( "does not break for a 1-element input array", function() {
		const wordCombinations = [
			new ProminentWord( "sentence", "sentence", 2 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 2 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "properly sorts the input array by stem before collapsing", function() {
		const wordCombinations = [
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "words", "word", 11 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 10 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 21 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "properly sorts the input array by stem before collapsing in Japanese", function() {
		const wordCombinations = [
			new ProminentWord( "猫", "猫", 2 ),
			new ProminentWord( "読まれ", "読ん", 11 ),
			new ProminentWord( "手紙", "手紙", 2 ),
			new ProminentWord( "読ん", "読ん", 10 ),
		];

		const expectedResult = [
			new ProminentWord( "手紙", "手紙", 2 ),
			new ProminentWord( "猫", "猫", 2 ),
			new ProminentWord( "読ん", "読ん", 21 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "properly sorts the input array by stem before collapsing: Also with abbreviations", function() {
		const wordCombinations = [
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "WORDs", "word", 11 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "WORD", "word", 10 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "WORD", "word", 21 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "deals with multiple repetitions of forms of the same stem", function() {
		const wordCombinations = [
			new ProminentWord( "index", "index", 6 ),
			new ProminentWord( "live", "live", 6 ),
			new ProminentWord( "amazing", "amaze", 3 ),
			new ProminentWord( "indexing", "index", 3 ),
			new ProminentWord( "seo", "seo", 3 ),
			new ProminentWord( "sites", "site", 3 ),
			new ProminentWord( "yoast", "yoast", 3 ),
			new ProminentWord( "yoast's", "yoast", 2 ),
			new ProminentWord( "bing", "bing", 2 ),
			new ProminentWord( "google", "google", 2 ),
			new ProminentWord( "live", "live", 2 ),
			new ProminentWord( "yoast", "yoast", 1 ),
			new ProminentWord( "site", "site", 1 ),
			new ProminentWord( "update", "update", 1 ),
		];

		const expectedResult = [
			new ProminentWord( "amazing", "amaze", 3 ),
			new ProminentWord( "bing", "bing", 2 ),
			new ProminentWord( "google", "google", 2 ),
			new ProminentWord( "index", "index", 9 ),
			new ProminentWord( "live", "live", 8 ),
			new ProminentWord( "seo", "seo", 3 ),
			new ProminentWord( "site", "site", 4 ),
			new ProminentWord( "update", "update", 1 ),
			new ProminentWord( "yoast", "yoast", 6 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "deals with multiple repetitions of forms of the same stem in Japanese", function() {
		const wordCombinations = [
			new ProminentWord( "休め", "休め", 6 ),
			new ProminentWord( "木材", "木材", 6 ),
			new ProminentWord( "含む全て", "含む全た", 3 ),
			new ProminentWord( "休ま", "休め", 3 ),
			new ProminentWord( "予定", "予定", 3 ),
			new ProminentWord( "話せる", "話さ", 3 ),
			new ProminentWord( "休め", "休め", 3 ),
			new ProminentWord( "休ませる", "休め", 2 ),
			new ProminentWord( "話", "話", 2 ),
			new ProminentWord( "天気", "天気", 2 ),
			new ProminentWord( "木材", "木材", 2 ),
			new ProminentWord( "休め", "休め", 1 ),
			new ProminentWord( "話さ", "話さ", 1 ),
			new ProminentWord( "ブログ", "ブログ", 1 ),
		];

		const expectedResult = [
			new ProminentWord( "ブログ", "ブログ", 1 ),
			new ProminentWord( "予定", "予定", 3 ),
			new ProminentWord( "休め", "休め", 15 ),
			new ProminentWord( "含む全て", "含む全た", 3 ),
			new ProminentWord( "天気", "天気", 2 ),
			new ProminentWord( "木材", "木材", 8 ),
			new ProminentWord( "話", "話", 2 ),
			new ProminentWord( "話さ", "話さ", 4 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes duplicates in the very beginning of the list", function() {
		const wordCombinations = [
			new ProminentWord( "sentences", "sentence", 2 ),
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "words", "word", 11 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 10 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 4 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 21 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes duplicates in the very end of the list", function() {
		const wordCombinations = [
			new ProminentWord( "sentences", "sentence", 2 ),
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 10 ),
			new ProminentWord( "words", "word", 11 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 4 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 21 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes multiple duplicates of stem", function() {
		const wordCombinations = [
			new ProminentWord( "sentences", "sentence", 2 ),
			new ProminentWord( "wording", "word", 3 ),
			new ProminentWord( "worded", "word", 5 ),
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "word", "word", 1 ),
			new ProminentWord( "sentencing", "sentence", 2 ),
			new ProminentWord( "words", "word", 2 ),
			new ProminentWord( "sentenced", "sentence", 4 ),
			new ProminentWord( "wordings", "word", 3 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 10 ),
			new ProminentWord( "word", "word", 14 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes multiple duplicates of stem and word", function() {
		const wordCombinations = [
			new ProminentWord( "word", "word", 1 ),
			new ProminentWord( "sentences", "sentence", 2 ),
			new ProminentWord( "wording", "word", 3 ),
			new ProminentWord( "worded", "word", 5 ),
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "word", "word", 1 ),
			new ProminentWord( "sentencing", "sentence", 2 ),
			new ProminentWord( "words", "word", 2 ),
			new ProminentWord( "sentenced", "sentence", 4 ),
			new ProminentWord( "wordings", "word", 3 ),
		];

		const expectedResult = [
			new ProminentWord( "sentence", "sentence", 10 ),
			new ProminentWord( "word", "word", 15 ),
		];

		const result = collapseProminentWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );
} );

describe( "getProminentWords", function() {
	it( "does not break and returns the word itself for a language without a language specific stemmer", function() {
		const input = "A text consists of words. This is a text.";
		const expected = [
			new ProminentWord( "a", "a", 2 ),
			new ProminentWord( "consists", "consists", 1 ),
			new ProminentWord( "is", "is", 1 ),
			new ProminentWord( "of", "of", 1 ),
			new ProminentWord( "text", "text", 2 ),
			new ProminentWord( "this", "this", 1 ),
			new ProminentWord( "words", "words", 1 ),
		];

		const words = getProminentWords( input, [], baseStemmer, [], false );

		expect( words ).toEqual( expected );
	} );

	it( "does not break if the input is empty", function() {
		const input = "";

		const words = getProminentWords( input, [], baseStemmer, [], false );

		expect( words ).toEqual( [] );
	} );

	it( "does not break if there are no words in the input", function() {
		const input = "! - ?.... ";
		const expected = [];
		const functionWords = [];
		const words = getProminentWords( input, [], baseStemmer, functionWords, false );

		expect( words ).toEqual( expected );
	} );

	it( "correctly takes single words from the text, orders them alphabetically", function() {
		const input = "A text contains words. This is a text.";
		const expected = [
			new ProminentWord( "text", "text", 2 ),
			new ProminentWord( "words", "words", 1 ),
		];

		const words = getProminentWords( input, [], baseStemmer, [ "a", "of", "contains", "this", "is" ], false );

		expect( words ).toEqual( expected );
	} );

	it( "takes all single words from the text, stems and counts them", function() {
		const input = "Word word word word word word word word word word. " +
			"More words, More words, More words, More words, More words, More words, More words, More words, 3 more words. " +
			"A whole new sentence, with more words here. " +
			"A whole new sentence, with more words here. ";
		const expected = [
			new ProminentWord( "3", "3", 1 ),
			new ProminentWord( "sentence", "sentence", 2 ),
			new ProminentWord( "whole", "whole", 2 ),
			new ProminentWord( "word", "word", 10 ),
			new ProminentWord( "words", "words", 11 ),
		];

		const words = getProminentWords( input, [], baseStemmer, [ "more", "a", "new", "with", "here" ], false );

		expect( words ).toEqual( expected );
	} );

	it( "correctly prevents abbreviations from being stemmed", function() {
		const input = "Here are a ton of syllables about CTA. Syllables are very important, syllables are the best. " +
			"Every syllable is a pain when it comes to producing them on demand. " +
			"It's so different when it's just free speech! A syllable then costs a tiny effort, almost " +
			"no effort at all! That is wonderful!! And here it comes again! " +
			"Here are tons of syllables about CTA. Syllables are very important, syllables are the best. " +
			"Every syllable is a pain when it comes to producing them on demand. " +
			"It's so different when it's just free speech! A syllable then costs a tiny effort, almost " +
			"no effort at all! That is wonderful!!";
		const expected = [
			new ProminentWord( "costs", "costs", 2 ),
			new ProminentWord( "CTA", "cta", 2 ),
			new ProminentWord( "demand", "demand", 2 ),
			new ProminentWord( "effort", "effort", 4 ),
			new ProminentWord( "free", "free", 2 ),
			new ProminentWord( "pain", "pain", 2 ),
			new ProminentWord( "producing", "producing", 2 ),
			new ProminentWord( "speech", "speech", 2 ),
			new ProminentWord( "syllable", "syllable", 4 ),
			new ProminentWord( "syllables", "syllables", 6 ),
			new ProminentWord( "wonderful", "wonderful", 2 ),
		];
		const functionWords = [ "here", "are", "a", "ton", "tons", "of", "about", "very", "important", "the", "best", "every",
			"is", "when", "it", "to", "comes", "them", "on", "it's", "so", "different", "just", "then", "tiny", "almost",
			"no", "at", "all", "that", "and", "again" ];

		const words = getProminentWords( input, [ "cta" ], baseStemmer, functionWords, false );

		expect( words ).toEqual( expected );
	} );

	it( "does not filter out anything if the language does not have function words", function() {
		const input = "Here are a ton of syllables Here are a ton of syllables";
		const expected = [
			new ProminentWord( "a", "a", 2 ),
			new ProminentWord( "are", "are", 2 ),
			new ProminentWord( "here", "here", 2 ),
			new ProminentWord( "of", "of", 2 ),
			new ProminentWord( "syllables", "syllables", 2 ),
			new ProminentWord( "ton", "ton", 2 ),
		];

		const words = getProminentWords( input, [], baseStemmer, [], false );

		expect( words ).toEqual( expected );
	} );

	it( "get the prominent words when the custom helper to get words from text is available", function() {
		// Japanese has the custom helper to get words from text.
		const input = "決機てわひ直基5易ワクニ改生終ル法境ヒ用続フメヲコ地新わ場田玲東るまル著固偏ぶてつ。";
		const expected = [
			new ProminentWord( "てつ", "てつ", 1 ),
			new ProminentWord( "ぶ", "ぶ", 1 ),
			new ProminentWord( "フメヲコ", "フメヲコ", 1 ),
			new ProminentWord( "ま", "ま", 1 ),
			new ProminentWord( "ル著", "ル著", 1 ),
			new ProminentWord( "ワクニ", "ワクニ", 1 ),
			new ProminentWord( "わひ", "わひ", 1 ),
			new ProminentWord( "固偏", "固偏", 1 ),
			new ProminentWord( "地新", "地新", 1 ),
			new ProminentWord( "場田", "場田", 1 ),
			new ProminentWord( "改生", "改生", 1 ),
			new ProminentWord( "易", "易", 1 ),
			new ProminentWord( "決機", "決機", 1 ),
			new ProminentWord( "法境ヒ", "法境ヒ", 1 ),
			new ProminentWord( "玲東る", "玲東る", 1 ),
			new ProminentWord( "用続", "用続", 1 ),
			new ProminentWord( "直基", "直基", 1 ),
			new ProminentWord( "終ル", "終ル", 1 ),
		];
		const researcher = new JapaneseResearcher( input );
		researcher.addResearchData( getMorphologyData( "ja" ), "morphology" );
		const japaneseStemmer = researcher.getHelper( "customGetStemmer" )( researcher );
		const words = getProminentWords( input, [], japaneseStemmer, [ "て", "わ", "5" ], getWordsCustomHelper );
		expect( words ).toEqual( expected );
		} );
} );

describe( "getRelevantWordsFromPaperAttributes", function() {
	it( "gets all non-function words from the attributes", function() {
		const expected = [
			new ProminentWord( "analysing", "analysing", 1 ),
			new ProminentWord( "interest", "interest", 1 ),
			new ProminentWord( "keyphrase", "keyphrase", 1 ),
			new ProminentWord( "metadescription", "metadescription", 1 ),
			new ProminentWord( "o-my", "o-my", 1 ),
			new ProminentWord( "paper", "paper", 1 ),
			new ProminentWord( "pretty", "pretty", 1 ),
			new ProminentWord( "subheading", "subheading", 2 ),
			new ProminentWord( "synonym", "synonym", 3 ),
			new ProminentWord( "title", "title", 1 ),
		];

		const words = getProminentWordsFromPaperAttributes(
			[
				"This is a NICE keyphrase",
				"This is a synonym one, a synonym two and an o-my synonym",
				"This is a pretty long title!",
				"This is an interesting metadescription of the paper that we are analysing and have interest in.",
				[ "subheading one", "subheading two" ].join( " " ),
			],
			[ "nice" ],
			baseStemmer,
			[ "interesting", "this", "is", "a", "an", "one", "two", "and", "long", "of", "the", "that", "we", "are", "have", "in", "nice" ],
			false
		);

		expect( words ).toEqual( expected );
	} );

	it( "get the prominent words from the attributes when the custom helper to get words from text is available", function() {
		// Japanese has the custom helper to get words from text.
		const expected = [
			new ProminentWord( "キーフレーズ", "キーフレーズ", 1 ),
			new ProminentWord( "タイトル", "タイトル", 1 ),
			new ProminentWord( "メタディスクリプション", "メタディスクリプション", 1 ),
			new ProminentWord( "最初", "最初", 1 ),
			new ProminentWord( "分析", "分析", 1 ),
			new ProminentWord( "同義", "同義", 2 ),
			new ProminentWord( "小見出し", "小見出し", 2 ),
			new ProminentWord( "持っ", "持っ", 1 ),
			new ProminentWord( "深い", "深い", 1 ),
			new ProminentWord( "番目", "番目", 1 ),
			new ProminentWord( "興味", "興味", 2 ),
			new ProminentWord( "語", "語", 2 ),
			new ProminentWord( "論文", "論文", 1 ),
			new ProminentWord( "長い", "長い", 1 ),
		];
		const researcher = new JapaneseResearcher( "" );
		researcher.addResearchData( getMorphologyData( "ja" ), "morphology" );
		const japaneseStemmer = researcher.getHelper( "customGetStemmer" )( researcher );
		const words = getProminentWordsFromPaperAttributes( [
			"これはいいキーフレーズです", "これは同義語1と同義語2です", "これはかなり長いタイトルです！", "これは、私たちが分析していて興味を持っている論文の興味深いメタディスクリプションです。", [ "最初の小見出し", "2番目の小見出し" ].join( " " ) ], [], japaneseStemmer, [ "2", "1", "い", "いい", "いる", "が", "かなり", "これ", "し", "たち", "て", "です", "と", "の", "は", "を", "私" ], getWordsCustomHelper );
		expect( words ).toEqual( expected );
		} );
} );
