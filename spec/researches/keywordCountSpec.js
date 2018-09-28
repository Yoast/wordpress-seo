/* global describe it expect */
import keywordCount from "../../src/researches/keywordCount.js";

import Paper from "../../src/values/Paper.js";
import factory from "../helpers/factory";

const buildMorphologyMockResearcher = function( keyphraseForms ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	}, true );
};

const mockResearcher = buildMorphologyMockResearcher( [ [ "keyword", "keywords" ] ] );
const mockResearcherGermanDiacritics = buildMorphologyMockResearcher( [ [ "äöüß" ] ] );
const mockResearcherMultipleKeywords = buildMorphologyMockResearcher(
	[ [ "keyword", "keywords" ], [ "strawberry", "strawberries" ] ]
);
const mockResearcherMinus = buildMorphologyMockResearcher( [ [ "key-word", "key-words" ] ] );
const mockResearcherUnderscore = buildMorphologyMockResearcher( [ [ "key_word", "key_words" ] ] );
const mockResearcherKeyWord = buildMorphologyMockResearcher( [ [ "key", "keys" ], [ "word", "words" ] ] );
const mockResearcherKaplaki = buildMorphologyMockResearcher( [ [ "kapaklı" ] ] );
const mockResearcherAmpersand = buildMorphologyMockResearcher( [ [ "key&word" ] ] );
const mockResearcherApostrophe = buildMorphologyMockResearcher( [ [ "key`word" ] ] );
// Escape, since the morphology researcher escapes regex as well.
const mockResearcherDollarSign = buildMorphologyMockResearcher( [ [ "\\$keyword" ] ] );

describe( "Test for counting the keyword in a text", function() {
	it( "counts a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 1 );
	} );

	it( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "a string of text, density should be 0.0%" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 0 );
	} );

	it( "counts a string of text with multiple occurrences of the keyword in it.", function() {
		const mockPaper = new Paper( "a string of text with the key word in it, with more key words." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
	} );

	it( "counts a string of text with german diacritics and eszett as the keyword", function() {
		const mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen." );
		expect( keywordCount( mockPaper, mockResearcherGermanDiacritics ).count ).toBe( 1 );
	} );

	it( "counts a string with multiple keyword morphological forms", function() {
		const mockPaper = new Paper( "A string of text with a keyword and multiple keywords in it." );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 2 );
	} );

	it( "counts a string with multiple keywords", function() {
		const mockPaper = new Paper( "A string with strawberries and a keyword." );
		expect( keywordCount( mockPaper, mockResearcherMultipleKeywords ).count ).toBe( 1 );
	} );

	it( "counts a string with a keyword with a '-' in it", function() {
		const mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
	} );

	it( "does not count a string with 'key-word' in it, if the keyword is 'key word'", function() {
		const mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} );

	it( "counts a string with a keyword with a '_' in it", function() {
		const mockPaper = new Paper( "A string with a key_word." );
		expect( keywordCount( mockPaper, mockResearcherUnderscore ).count ).toBe( 1 );
	} );

	it( "counts a string with with 'kapaklı' as a keyword in it", function() {
		const mockPaper = new Paper( "A string with kapaklı." );
		expect( keywordCount( mockPaper, mockResearcherKaplaki ).count ).toBe( 1 );
	} );

	it( "counts a string with with '&' in the string and the keyword", function() {
		const mockPaper = new Paper( "A string with key&word" );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 1 );
	} );

	it( "does not count images as keywords.", function() {
		const mockPaper = new Paper( "<img src='http://image.com/image.png'>" );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 0 );
	} );

	it( "keyword counting is blind to CApiTal LeTteRs.", function() {
		const mockPaper = new Paper( "A string with KeY worD." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} );

	it( "keyword counting is blind to types of apostrophe.", function() {
		const mockPaper = new Paper( "a string with quotes to match the key'word, even if the quotes differ" );
		expect( keywordCount( mockPaper, mockResearcherApostrophe ).count ).toBe( 1 );
	} );

	it( "counts can count dollar sign as in '$keyword'.", function() {
		const mockPaper = new Paper( "a string with a $keyword" );
		expect( keywordCount( mockPaper, mockResearcherDollarSign ).count ).toBe( 1 );
	} );

	it( "counts a string of text with a keyword in it once, even if the text contains 'key-word' as well.", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit " );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
	} );

	it( "only counts full key phrases (when all keywords are in the sentence once, twice etc.) as matches.", function() {
		const mockPaper = new Paper( "A string with three keys (key and another key) and one word." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} )
} );
