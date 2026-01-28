import transitionWordsResearch from "../../../src/languageProcessing/researches/findTransitionWords.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import buildTree from "../../specHelpers/parse/buildTree";

describe( "a test for finding transition words from a string", function() {
	let mockPaper, result;
	const mockResearcher = new EnglishResearcher( mockPaper );

	it( "returns 1 when a transition word is found in the middle of a sentence (English)", function() {
		// Transition word: above all.
		mockPaper = new Paper( "this story is, above all, about a boy", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when a transition word is not in consecutive order", function() {
		// Transition word: above all.
		mockPaper = new Paper( "this story is, above, about a boy, all", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word with capital is found at the beginning of a sentence (English)", function() {
		// Transition word: firstly.
		mockPaper = new Paper( "Firstly, I'd like to say", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word combination is found in the middle of a sentence (English)", function() {
		// Transition word: different from.
		mockPaper = new Paper( "that is different from something else", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word combination is found at the end of a sentence (English)", function() {
		// Transition word: for example.
		mockPaper = new Paper( "A story, for example", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence, and no transition word in another sentence. (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. Okay?", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 2 when a two-part transition word is found in a sentence, and a transition word in another sentence. (English)", function() {
		// Transition words: either...or, unless.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. Unless it is about a boy.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 when a two-part transition word is found in two sentences. (English)", function() {
		// Transition words: either...or, both...and.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. She was both furious and disappointed.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 when a two-part transition word is found in two sentences, " +
		"and an additional transition word is found in one of them. (English)", function() {
		// Transition words: either...or, both...and, as soon as.
		mockPaper = new Paper( "I will either tell you a story about a boy, or read you a novel. " +
			"I can read it to both you and her as soon as you're ready.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 1 when a transition word abbreviation found in a sentence (English)", function() {
		// Transition word: e.g..
		mockPaper = new Paper( "That is e.g. a story...", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when 2 transition words are found in the same sentence (English)", function() {
		// Transition words: firstly, for example.
		mockPaper = new Paper( "Firstly, I'd like to tell a story, for example", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 2 when 2 transition words are found in two sentences (1 transition word each) (English)", function() {
		// Transition words: firstly, for example.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. For example.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 in the case of a sentence with 1 transition word and a sentence with 2 transition words) (English)", function() {
		// Transition words: firstly, for example, as I have said.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. For example, about you, as I have said.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 1 in the case of a sentence with 1 transition word and a sentence without transition words) (English)", function() {
		// Transition word: firstly.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. Haha.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word  is found in a sentence (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (English)", function() {
		mockPaper = new Paper( "nothing special", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 0 when no transition words are present in multiple sentences (English)", function() {
		mockPaper = new Paper( "nothing special. Nothing special Either. Boring!", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 3 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "ignores transition words inside elements we want to exclude from the analysis", function() {
		mockPaper = new Paper( "There is a hidden transition word <code>however</code> in this sentence.", { locale: "en_US" } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "should find transition words in brackets", function() {
		mockPaper = new Paper( "There is a hidden transition word [however] in this sentence." );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "should ignore transition words if they are shortcodes", function() {
		mockPaper = new Paper( "There is a hidden transition word [however] in this sentence.", { shortcodes: [ "however" ] } );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word with an apostrophe is found in a sentence (French)", function() {
		// Transition word: quoi qu’il en soit.
		mockPaper = new Paper( "Quoi qu’il en soit, le gouvernement du Mali a perdu sa légitimité.", { locale: "fr_FR" } );
		const frenchResearcher = new FrenchResearcher( mockPaper );
		buildTree( mockPaper, frenchResearcher );
		result = transitionWordsResearch( mockPaper, frenchResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a (single) transition word is found in a sentence (Japanese)", function() {
		// Transition word: とりわけ
		mockPaper = new Paper( "とりわけ、いくつかの良い例が必要です", { locale: "ja" } );
		const japaneseResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, japaneseResearcher );
		result = transitionWordsResearch( mockPaper, japaneseResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a (multiple) transition word is found in a language that uses a custom" +
		" match transition word helper (Japanese)", function() {
		// Transition word: ゆえに (tokenized: [ "ゆえ", "に" ])
		const japaneseResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, japaneseResearcher );
		result = transitionWordsResearch( mockPaper, japaneseResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence for a language that uses a" +
		" custom match transition word helper (Japanese)", function() {
		mockPaper = new Paper( "この例文は、書き方のサンプルなので必要に応じて内容を追加削除をしてからお使いください。", { locale: "ja" } );
		const japaneseResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, japaneseResearcher );
		result = transitionWordsResearch( mockPaper, japaneseResearcher );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "works with normalizes quotes", function() {
		// Transition word: what’s more.
		mockPaper = new Paper( "what’s more", {} );
		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );

		expect( result.totalSentences ).toEqual( 1 );
		expect( result.sentenceResults[ 0 ].sentence.text ).toEqual( "what’s more" );
		expect( result.sentenceResults[ 0 ].sentence.tokens.length ).toEqual( 3 );
		expect( result.sentenceResults[ 0 ].transitionWords ).toEqual( [ "what's more" ] );
		expect( result.transitionWordSentences ).toEqual( 1 );
	} );

	it( "works with the no-break space character", function() {
		// Transition word: then.
		mockPaper = new Paper( "and\u00a0then" );

		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );

		expect( result.sentenceResults[ 0 ].sentence.text ).toEqual( "and then" );
		expect( result.sentenceResults[ 0 ].sentence.tokens.length ).toEqual( 3 );
		expect( result.totalSentences ).toEqual( 1 );
		expect( result.transitionWordSentences ).toEqual( 1 );
	} );

	it( "does not recognize 'eggs' as a transition word (don't ask).", function() {
		// Non-transition word: eggs.
		mockPaper = new Paper( "Let's bake some eggs." );

		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );

		expect( result.totalSentences ).toEqual( 1 );
		expect( result.transitionWordSentences ).toEqual( 0 );
		expect( result.sentenceResults.length ).toEqual( 0 );
	} );

	it( "does recognize transition words with full stops, like 'e.g.'.", function() {
		// Transition words: e.g., i.e.
		mockPaper = new Paper( "E.g. potatoes. I.e. apples." );

		buildTree( mockPaper, mockResearcher );
		result = transitionWordsResearch( mockPaper, mockResearcher );

		expect( result.totalSentences ).toEqual( 2 );
		expect( result.transitionWordSentences ).toEqual( 2 );
		expect( result.sentenceResults[ 0 ].sentence.text ).toEqual( "E.g. potatoes." );
		expect( result.sentenceResults[ 0 ].transitionWords ).toEqual( [ "e.g." ] );
		expect( result.sentenceResults[ 1 ].sentence.text ).toEqual( " I.e. apples." );
		expect( result.sentenceResults[ 1 ].transitionWords ).toEqual( [ "i.e." ] );
	} );
} );
