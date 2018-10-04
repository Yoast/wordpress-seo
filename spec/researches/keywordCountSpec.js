/* global describe it expect */
import keywordCount from "../../src/researches/keywordCount.js";

import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory";
import Mark from "../../src/values/Mark";

const buildMorphologyMockResearcher = function( keyphraseForms ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	}, true );
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
	it( "counts/marks a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "a string of text with the keyword in it" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcher ).markings ).toEqual( [
			new Mark( { marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword in it" } )	]
		);
	} );

	it( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "a string of text" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 0 );
		expect( keywordCount( mockPaper, mockResearcher ).markings ).toEqual( [] );
	} );

	it( "counts multiple occurrences of a keyphrase consisting of multiple words.", function() {
		const mockPaper = new Paper( "a string of text with the key word in it, with more key words." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( { marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
				"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
			original: "a string of text with the key word in it, with more key words." } ) ]
		);
	} );

	it( "counts a string of text with German diacritics and eszett as the keyword", function() {
		const mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen." );
		expect( keywordCount( mockPaper, mockResearcherGermanDiacritics ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherGermanDiacritics ).markings ).toEqual( [
			new Mark( { marked: "Waltz keepin auf mitz auf keepin <yoastmark class='yoast-text-mark'>äöüß</yoastmark> weiner blitz deutsch spitzen.",
				original: "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen." } )	]
		);
	} );

	it( "counts a string with multiple keyword morphological forms", function() {
		const mockPaper = new Paper( "A string of text with a keyword and multiple keywords in it." );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 2 );
		expect( keywordCount( mockPaper, mockResearcher ).markings ).toEqual( [
			new Mark( { marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
				original: "A string of text with a keyword and multiple keywords in it." } ) ]
		);
	} );

	it( "counts a string with a keyword with a '-' in it", function() {
		const mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherMinus ).markings ).toEqual( [
			new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key-word</yoastmark>.",
				original: "A string with a key-word." } ) ]
		);
	} );

	it( "counts 'key word' in 'key-word'.", function() {
		const mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		// Note: this behavior might change in the future.
	} );

	it( "counts a string with a keyword with a '_' in it", function() {
		const mockPaper = new Paper( "A string with a key_word." );
		expect( keywordCount( mockPaper, mockResearcherUnderscore ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherUnderscore ).markings ).toEqual( [
			new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key_word</yoastmark>.",
				original: "A string with a key_word." } ) ]
		);
	} );

	it( "counts a string with with 'kapaklı' as a keyword in it", function() {
		const mockPaper = new Paper( "A string with kapaklı." );
		expect( keywordCount( mockPaper, mockResearcherKaplaki ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherKaplaki ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>kapaklı</yoastmark>.",
				original: "A string with kapaklı." } ) ]
		);
	} );

	it( "counts a string with with '&' in the string and the keyword", function() {
		const mockPaper = new Paper( "A string with key&word." );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>key&word</yoastmark>.",
				original: "A string with key&word." } )	]
		);
	} );

	it( "does not count images as keywords.", function() {
		const mockPaper = new Paper( "<img src='http://image.com/image.png'>" );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 0 );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).markings ).toEqual( [] );
	} );

	it( "keyword counting is blind to CApiTal LeTteRs.", function() {
		const mockPaper = new Paper( "A string with KeY worD." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( { marked: "A string with <yoastmark class='yoast-text-mark'>KeY worD</yoastmark>.",
				original: "A string with KeY worD." } )	]
		);
	} );

	it( "keyword counting is blind to types of apostrophe.", function() {
		const mockPaper = new Paper( "A string with quotes to match the key'word, even if the quotes differ." );
		expect( keywordCount( mockPaper, mockResearcherApostrophe ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherApostrophe ).markings ).toEqual( [
			new Mark( { marked: "A string with quotes to match the <yoastmark class='yoast-text-mark'>key'word</yoastmark>, even if the quotes differ.",
				original: "A string with quotes to match the key'word, even if the quotes differ." } ) ]
		);
	} );

	it( "counts can count dollar sign as in '$keyword'.", function() {
		const mockPaper = new Paper( "A string with a $keyword." );
		expect( keywordCount( mockPaper, mockResearcherDollarSign ).count ).toBe( 1 );
		// Markings do not currently work in this condition.
	} );

	it( "counts 'key word' also in 'key-word'.)", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
		// Note: this behavior might change in in the future.
	} );

	it( "doesn't count 'key-word' in 'key word'.", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit." );
		expect( keywordCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
		// Note: this behavior might change in in the future.
	} );

	it( "only counts full key phrases (when all keywords are in the sentence once, twice etc.) as matches.", function() {
		const mockPaper = new Paper( "A string with three keys (key and another key) and one word." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).markings ).toEqual( [
			new Mark( { marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark class='yoast-text-mark'>word</yoastmark>.",
				original: "A string with three keys (key and another key) and one word." } ) ]
		);
	} );
} );
