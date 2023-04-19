import keyphraseCount from "../../../src/languageProcessing/researches/keywordCount";
import Paper from "../../../src/values/Paper.js";
import factory from "../../specHelpers/factory";
import Mark from "../../../src/values/Mark";
import wordsCountHelper from "../../../src/languageProcessing/languages/ja/helpers/wordsCharacterCount";
import matchWordsHelper from "../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import japaneseMemoizedSentenceTokenizer from "../../../src/languageProcessing/languages/ja/helpers/memoizedSentenceTokenizer";
import buildTree from "../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";

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

const mockResearcher = buildMorphologyMockResearcher( [ [ "keyword", "keywords" ] ] );
const mockResearcherGermanDiacritics = buildMorphologyMockResearcher( [ [ "äöüß" ] ] );
const mockResearcherMinus = buildMorphologyMockResearcher( [ [ "key-word", "key-words" ] ] );
const mockResearcherUnderscore = buildMorphologyMockResearcher( [ [ "key_word", "key_words" ] ] );
const mockResearcherKeyWord = buildMorphologyMockResearcher( [ [ "key", "keys" ], [ "word", "words" ] ] );
const mockResearcherKaplaki = buildMorphologyMockResearcher( [ [ "kapaklı" ] ] );
const mockResearcherAmpersand = buildMorphologyMockResearcher( [ [ "key&word" ] ] );
const mockResearcherApostrophe = buildMorphologyMockResearcher( [ [ "key`word" ] ] );
// Escape, since the morphology researcher escapes regex as well.
const mockResearcherDollarSign = buildMorphologyMockResearcher( [ [ "\\$keyword" ] ] );

describe( "Test for counting the keyword in a text", function() {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
	} );
	it( "counts/marks a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "<p>a string of text with the keyword and another keyword in it</p>", { keyword: "keyword" } );
		researcher.setPaper( mockPaper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 2 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual(
			[ new Mark( {
				fieldsToMark: [],
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> and" +
						" another <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword and another keyword in it",
				position: { endOffset: 36, startOffset: 29 },
			} ),
			new Mark( {
				fieldsToMark: [],
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
						"and another <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword and another keyword in it",
				position: { endOffset: 56, startOffset: 49 } } ),
			] );
	} );

	it( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "a string of text" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcher ).count ).toBe( 0 );
		expect( keyphraseCount( mockPaper, mockResearcher ).markings ).toEqual( [] );
	} );

	it( "counts multiple occurrences of a keyphrase consisting of multiple words.", function() {
		const mockPaper = new Paper( "<p>a string of text with the key word in it, with more key words.</p>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( {
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
				"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
				original: "a string of text with the key word in it, with more key words.",
				// eslint-disable-next-line no-undefined
				position: { endOffset: 37, startOffset: 29 } }

			),
			new Mark( {
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
					"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
				original: "a string of text with the key word in it, with more key words.",
				// eslint-disable-next-line no-undefined
				position: { endOffset: 64, startOffset: 55 },
			} ) ]
		);
	} );

	it( "counts a string of text with German diacritics and eszett as the keyword", function() {
		const mockPaper = new Paper( "<p>Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.</p>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherGermanDiacritics ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherGermanDiacritics ).markings ).toEqual( [
			new Mark( {
				marked: "Waltz keepin auf mitz auf keepin <yoastmark class='yoast-text-mark'>äöüß</yoastmark> weiner blitz deutsch spitzen.",
				original: "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.",
				position: { endOffset: 40, startOffset: 36 } } )	]
		);
	} );

	it( "counts a string with multiple keyword morphological forms", function() {
		const mockPaper = new Paper( "<div>A string of text with a keyword and multiple keywords in it.</div>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcher ).count ).toBe( 2 );
		expect( keyphraseCount( mockPaper, mockResearcher ).markings ).toEqual( [
			new Mark( {
				marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
					"and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
				original: "A string of text with a keyword and multiple keywords in it.",
				position: { endOffset: 36, startOffset: 29 } } ),
			new Mark( {
				marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
					"and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
				original: "A string of text with a keyword and multiple keywords in it.",
				position: { endOffset: 58, startOffset: 50 } } ) ]
		);
	} );

	it( "counts a string with a keyword with a '-' in it", function() {
		const mockPaper = new Paper( "<h2>A string with a key-word.</h2>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherMinus ).markings ).toEqual( [
			new Mark( {
				marked: "A string with a <yoastmark class='yoast-text-mark'>key-word</yoastmark>.",
				original: "A string with a key-word.",
				position: { endOffset: 28, startOffset: 20 } } ) ]
		);
	} );

	it( "counts 'key word' in 'key-word'.", function() {
		const mockPaper = new Paper( "<span>A string with a key-word.</span>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} );

	it( "counts a string with a keyword with a '_' in it", function() {
		const mockPaper = new Paper( "<p>A string with a key_word.</p>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherUnderscore ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherUnderscore ).markings ).toEqual( [
			new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key_word</yoastmark>.",
				original: "A string with a key_word.",
				position: { endOffset: 27, startOffset: 19 } } ) ]
		);
	} );

	it( "counts a string with with 'kapaklı' as a keyword in it", function() {
		const mockPaper = new Paper( "<p>A string with kapaklı.</p>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKaplaki ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherKaplaki ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>kapaklı</yoastmark>.",
				original: "A string with kapaklı.",
				position: { endOffset: 24, startOffset: 17 } } ) ]
		);
	} );

	it( "counts a string with with '&' in the string and the keyword", function() {
		const mockPaper = new Paper( "<h6>A string with key&word.</h6>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherAmpersand ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>key&word</yoastmark>.",
				original: "A string with key&word.",
				position: { endOffset: 26, startOffset: 18 } } )	]
		);
	} );

	it( "does not count images as keywords.", function() {
		const mockPaper = new Paper( "<img src='http://image.com/image.png'>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 0 );
		expect( keyphraseCount( mockPaper, mockResearcherAmpersand ).markings ).toEqual( [] );
	} );

	it( "keyword counting is blind to CApiTal LeTteRs.", function() {
		const mockPaper = new Paper( "<h3>A string with KeY worD.</h3>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>KeY worD</yoastmark>.",
				original: "A string with KeY worD.",
				position: { endOffset: 26, startOffset: 18 } } )	]
		);
	} );

	it( "keyword counting is blind to types of apostrophe.", function() {
		const mockPaper = new Paper( "<p><span>A string with quotes to match the key'word, even if the quotes differ.</span></p>" );
		buildTree( mockPaper, mockResearcher );
		console.log(mockPaper.getTree());
		expect( keyphraseCount( mockPaper, mockResearcherApostrophe ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherApostrophe ).markings ).toEqual( [
			new Mark( { marked: "A string with quotes to match the <yoastmark class='yoast-text-mark'>key'word</yoastmark>, " +
					"even if the quotes differ.",
			original: "A string with quotes to match the key'word, even if the quotes differ.",  position: { endOffset: 45, startOffset: 37 } } ) ]
		);
	} );

	it( "counts can count dollar sign as in '$keyword'.", function() {
		const mockPaper = new Paper( "A string with a $keyword." );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherDollarSign ).count ).toBe( 1 );
		// Markings do not currently work in this condition.
	} );

	it( "counts 'key word' also in 'key-word'.)", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit." );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
		// Note: this behavior might change in in the future.
	} );

	it( "doesn't count 'key-word' in 'key word'.", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit." );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
		// Note: this behavior might change in in the future.
	} );

	it( "only counts full key phrases (when all keywords are in the sentence once, twice etc.) as matches.", function() {
		const mockPaper = new Paper( "A string with three keys (key and another key) and one word." );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( { marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
			original: "A string with three keys (key and another key) and one word." } ) ]
		);
	} );

	it( "counts 'key word' when interjected with a function word.", function() {
		const mockPaper = new Paper( "<span>A string with a key the word.</span>" );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		// Note: this behavior might change in the future.
	} );

	it( "doesn't match singular forms in reduplicated plurals in Indonesian", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit.", { locale: "id_ID" } );
		buildTree( mockPaper, mockResearcher );
		expect( keyphraseCount( mockPaper, mockResearcher ).count ).toBe( 1 );
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
	it( "counts/marks a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。", { locale: "ja", keyphrase: "猫" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );

		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいいです。",
				original: "私の猫はかわいいです。" } ) ] );
	} );

	it( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "会い" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 0 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [] );
	} );

	it( "counts multiple occurrences of a keyphrase consisting of multiple words.", function() {
		const mockPaper = new Paper( "私の猫はかわいいですかわいい。",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "かわいい" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
			} ) ] );
	} );
} );
