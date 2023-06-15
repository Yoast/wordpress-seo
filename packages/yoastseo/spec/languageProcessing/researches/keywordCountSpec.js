import keyphraseCount from "../../../src/languageProcessing/researches/keywordCount";
import Paper from "../../../src/values/Paper.js";
import factory from "../../specHelpers/factory";
import Mark from "../../../src/values/Mark";
import wordsCountHelper from "../../../src/languageProcessing/languages/ja/helpers/wordsCharacterCount";
import matchWordsHelper from "../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import japaneseMemoizedSentenceTokenizer from "../../../src/languageProcessing/languages/ja/helpers/memoizedSentenceTokenizer";
import buildTree from "../../specHelpers/parse/buildTree";

/**
 * Adds morphological forms to the mock researcher.
 *
 * @param {Array} keyphraseForms The morphological forms to be added to the researcher.
 *
 * @returns {Researcher} The mock researcher with added morphological forms.
 */
const buildMorphologyMockResearcher = function( keyphraseForms ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	}, true, false, false, { memoizedTokenizer: memoizedSentenceTokenizer } );
};

const testCases = [
	{
		description: "counts/marks a string of text with a keyword in it.",
		paper: new Paper( "a string of text with the keyword in it", { keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword in it" } ),
		],
	},
	{
		description: "counts a string of text with no keyword in it.",
		paper: new Paper( "a string of text", { keyword: "" } ),
		keyphraseForms: [ [ "" ] ],
		expectedCount: 0,
		expectedMarkings: [],
	},
	{
		description: "counts multiple occurrences of a keyphrase consisting of multiple words.",
		paper: new Paper( "a string of text with the key word in it, with more key words.", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 2,
		expectedMarkings: [
			new Mark( { marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
					"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
			original: "a string of text with the key word in it, with more key words." } ) ],

	},
	{
		description: "counts a string of text with German diacritics and eszett as the keyword",
		paper: new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.", { keyword: "äöüß" } ),
		keyphraseForms: [ [ "äöüß" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "Waltz keepin auf mitz auf keepin <yoastmark class='yoast-text-mark'>äöüß</yoastmark> weiner blitz deutsch spitzen.",
				original: "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen." } ) ],
	},
	{
		description: "counts a string with multiple keyword morphological forms",
		paper: new Paper( "A string of text with a keyword and multiple keywords in it.", { keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 2,
		expectedMarkings: [ new Mark( { marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
				"and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
		original: "A string of text with a keyword and multiple keywords in it." } ) ],

	},
	{
		description: "counts a string with a keyword with a '-' in it",
		paper: new Paper( "A string with a key-word.", { keyword: "key-word" } ),
		keyphraseForms: [ [ "key-word", "key-words" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key-word</yoastmark>.",
			original: "A string with a key-word." } ) ],

	},
	{
		description: "counts 'key word' in 'key-word'.",
		paper: new Paper( "A string with a key-word.", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( {
			marked: "A string with a <yoastmark class='yoast-text-mark'>key</yoastmark>-<yoastmark class='yoast-text-mark'>word</yoastmark>.",
			original: "A string with a key-word." } ) ],
		// Note: this behavior might change in the future.
	},
	{
		description: "counts a string with a keyword with a '_' in it",
		paper: new Paper( "A string with a key_word.", { keyword: "key_word" } ),
		keyphraseForms: [ [ "key_word", "key_words" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key_word</yoastmark>.",
			original: "A string with a key_word." } ) ],
	},
	{
		description: "counts a string with with a 'ı' in the keyphrase",
		paper: new Paper( "A string with with 'kapaklı' as a keyword in it", { keyword: "kapaklı" } ),
		keyphraseForms: [ [ "kapaklı" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with with '<yoastmark class='yoast-text-mark'>kapaklı</yoastmark>' as a keyword in it",
			original: "A string with with 'kapaklı' as a keyword in it" } ) ],
	},
	{
		description: "counts a string with with '&' in the string and the keyword",
		paper: new Paper( "A string with key&word in it", { keyword: "key&word" } ),
		keyphraseForms: [ [ "key&word" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>key&word</yoastmark> in it",
			original: "A string with key&word in it" } ) ],
	},
	{
		description: "does not count images as keywords.",
		paper: new Paper( "<img src='http://image.com/image.jpg' alt='image' />", { keyword: "image" } ),
		keyphraseForms: [ [ "image", "images" ] ],
		expectedCount: 0,
		expectedMarkings: [],
	},
	{
		description: "keyword counting is blind to CApiTal LeTteRs.",
		paper: new Paper( "A string with KeY worD.", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>KeY worD</yoastmark>.",
				original: "A string with KeY worD." } )	],
	},
	{
		description: "keyword counting is blind to types of apostrophe.",
		paper: new Paper( "A string with quotes to match the key'word, even if the quotes differ.", { keyword: "key'word" } ),
		keyphraseForms: [ [ "key'word", "key'words" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( {
			marked: "A string with quotes to match the <yoastmark class='yoast-text-mark'>key'word</yoastmark>, even if the quotes differ.",
			original: "A string with quotes to match the key'word, even if the quotes differ." } ) ],
	},
	{
		description: "can match dollar sign as in '$keyword'.",
		paper: new Paper( "A string with a $keyword." ),
		keyphraseForms: [ [ "\\$keyword" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>$keyword</yoastmark>.",
			original: "A string with a $keyword." } ) ],
	},
	{
		description: "doesn't count 'key-word' in 'key word'.",
		paper: new Paper( "A string with a key word.", { keyword: "key-word" } ),
		keyphraseForms: [ [ "key-word", "key-words" ] ],
		expectedCount: 0,
		expectedMarkings: [],
	},
	{
		description: "doesn't count keyphrase instances inside elements we want to exclude from the analysis",
		paper: new Paper( "There is no <code>keyword</code> in this sentence." ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 0,
		expectedMarkings: [],
	},
	{
		description: "only counts full key phrases (when all keywords are in the sentence once, twice etc.) as matches.",
		paper: new Paper( "A string with three keys (key and another key) and one word." ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
			original: "A string with three keys (key and another key) and one word." } ) ],
	},
	{
		description: "doesn't match singular forms in reduplicated plurals in Indonesian",
		paper: new Paper( "Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit.",
			{ locale: "id_ID", keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				// eslint-disable-next-line max-len
				marked: "Lorem ipsum dolor sit amet, consectetur <yoastmark class='yoast-text-mark'>keyword</yoastmark>-<yoastmark class='yoast-text-mark'>keyword</yoastmark>, <yoastmark class='yoast-text-mark'>keyword</yoastmark> adipiscing elit.",
				original: "Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit." } ) ],
	},
	{
		description: "counts a single word keyphrase with exact matching",
		paper: new Paper( "A string with a keyword.", { keyword: "\"keyword\"" } ),
		keyphraseForms: [ [ "keyword" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
			original: "A string with a keyword." } ) ],
	},
	{
		description: "with exact matching, a singular single word keyphrase should not be counted if the focus keyphrase is plural",
		paper: new Paper( "A string with a keyword.", { keyword: "\"keywords\"" } ),
		keyphraseForms: [ [ "keywords" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "with exact matching, a multi word keyphrase should be counted if the focus keyphrase is the same",
		paper: new Paper( "A string with a key phrase.", { keyword: "\"key phrase\"" } ),
		keyphraseForms: [ [ "key phrase" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key phrase</yoastmark>.",
			original: "A string with a key phrase." } ) ],
		skip: false,
	},
	{
		// eslint-disable-next-line max-len
		description: "with exact matching, a multi word keyphrase should not me counted if the focus keyphrase has the same words in a different order",
		paper: new Paper( "A string with a phrase key.", { keyword: "\"key phrase\"" } ),
		keyphraseForms: [ [ "key phrase" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "with exact matching, it should match a full stop if it is part of the keyphrase and directly precedes the keyphrase.",
		paper: new Paper( "A .sentence with a keyphrase.", { keyword: "\".sentence\"" } ),
		keyphraseForms: [ [ ".sentence" ] ],
		expectedCount: 1,
		expectedMarkings: [ new Mark( { marked: "A <yoastmark class='yoast-text-mark'>.sentence</yoastmark> with a keyphrase.",
			original: "A .sentence with a keyphrase." } ) ],
		skip: false,
	},

];

// eslint-disable-next-line max-len
describe.each( testCases )( "Test for counting the keyword in a text in english", function( { description, paper, keyphraseForms, expectedCount, expectedMarkings, skip } ) {
	const test = skip ? it.skip : it;

	test( description, function() {
		const mockResearcher = buildMorphologyMockResearcher( keyphraseForms );
		const keyWordCountResult = keyphraseCount( paper, mockResearcher );
		expect( keyWordCountResult.count ).toBe( expectedCount );
		expect( keyWordCountResult.markings ).toEqual( expectedMarkings );
	} );
} );

/**
 * Mocks Japanese Researcher.
 * @param {Array} keyphraseForms    The morphological forms to be added to the researcher.
 * @param {function} helper1        A helper needed for the assesment.
 * @param {function} helper2        A helper needed for the assesment.
 *
 * @returns {Researcher} The mock researcher with added morphological forms and custom helper.
 */
const buildJapaneseMockResearcher = function( keyphraseForms, helper1, helper2 ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	},
	true,
	true,
	false,
	{
		wordsCharacterCount: helper1,
		matchWordCustomHelper: helper2,
		memoizedTokenizer: japaneseMemoizedSentenceTokenizer,
	} );
};


// Decided not to remove test below as it tests the added logic of the Japanese helpers.
describe( "Test for counting the keyword in a text for Japanese", () => {
	it.skip( "counts/marks a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいいです。</p?", { locale: "ja", keyphrase: "猫" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );

		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいいです。",
				original: "私の猫はかわいいです。", position: { endOffset: 6, startOffset: 5 } } ) ] );
	} );

	it.skip( "counts/marks a string of text with multiple occurences of the same keyword in it.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいい猫です。</p?", { locale: "ja", keyphrase: "猫" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );

		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 2 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいい<yoastmark class='yoast-text-mark'>猫</yoastmark>です。",
				original: "私の猫はかわいい猫です。",
				position: { endOffset: 6, startOffset: 5 } } ), new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいい" +
					"<yoastmark class='yoast-text-mark'>猫</yoastmark>です。",
			original: "私の猫はかわいい猫です。",
			position: { endOffset: 12, startOffset: 11 } } ) ] );
	} );

	it.skip( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "会い" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 0 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [] );
	} );

	it.skip( "counts multiple occurrences of a keyphrase consisting of multiple words.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいいですかわいい。</p>",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "かわいい" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 6, startOffset: 5 },
			} ),
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 11, startOffset: 7 },
			} ),
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 17, startOffset: 13 },
			} ),
		] );
	} );
} );
