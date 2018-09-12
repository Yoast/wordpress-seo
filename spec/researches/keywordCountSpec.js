/* global describe it expect */
import keywordCount from "../../src/researches/keywordCount.js";

import Paper from "../../src/values/Paper.js";
import factory from "../helpers/factory";

const mockResearcher = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "keyword", "keywords" ] ],
	},
}, true );

const mockResearcherGermanDiacritics = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "äöüß" ] ],
	},
}, true );

const mockResearcherMultipleKeywords = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "keyword", "keywords" ], [ "strawberry", "strawberries" ] ],
	},
}, true );

const mockResearcherMinus = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "key-word", "key-words" ] ],
	},
}, true );

const mockResearcherUnderscore = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "key_word", "key_words" ] ],
	},
}, true );

const mockResearcherKeyWord = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
	},
}, true );

const mockResearcherKaplaki = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "kapaklı" ] ],
	},
}, true );

const mockResearcherAmpersand = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "key&word" ] ],
	},
}, true );

const mockResearcherApostrophe = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "key`word" ] ],
	},
}, true );

const mockResearcherDollarSign = factory.buildMockResearcher( {
	morphology: {
		keyphraseForms: [ [ "$keyword" ] ],
	},
}, true );

describe( "Test for counting the keyword in a text", function() {

	it( "counts a string of text with a keyword in it.", function() {
		let mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 1 );
	} );

	it( "counts a string of text with no keyword in it.", function() {
		let mockPaper = new Paper( "a string of text, density should be 0.0%" );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 0 );
	} );

	it( "counts a string of text with multiple occurrences of the keyword in it.", function() {
		let mockPaper = new Paper( "a string of text with the key word in it, with more key words." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
	} );

	it( "counts a string of text with german diacritics and eszett as the keyword", function() {
		let mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen." );
		expect( keywordCount( mockPaper, mockResearcherGermanDiacritics ).count ).toBe( 1 );
	} );

	it( "counts a string with multiple keyword morphological forms", function() {
		let mockPaper = new Paper( "A string of text with a keyword and multiple keywords in it." );
		expect( keywordCount( mockPaper, mockResearcher ).count ).toBe( 2 );
	} );

	it( "counts a string with multiple keywords", function() {
		let mockPaper = new Paper( "A string with strawberries and a keyword." );
		expect( keywordCount( mockPaper, mockResearcherMultipleKeywords ).count ).toBe( 1 );
	} );

	it( "counts a string with a keyword with a '-' in it", function() {
		let mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherMinus ).count ).toBe( 1 );
	} );

	it( "does not count a string with 'key-word' in it, if the keyword is 'key word'", function() {
		let mockPaper = new Paper( "A string with a key-word." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} );

	it( "counts a string with a keyword with a '_' in it", function() {
		let mockPaper = new Paper( "A string with a key_word." );
		expect( keywordCount( mockPaper, mockResearcherUnderscore ).count ).toBe( 1 );
	} );

	it( "counts a string with with 'kapaklı' as a keyword in it", function() {
		let mockPaper = new Paper( "A string with kapaklı." );
		expect( keywordCount( mockPaper, mockResearcherKaplaki ).count ).toBe( 1 );
	} );

	it( "counts a string with with '&' in the string and the keyword", function() {
		let mockPaper = new Paper( "A string with key&word" );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 1 );
	} );

	it( "does not count images as keywords.", function() {
		let mockPaper = new Paper( "<img src='http://image.com/image.png'>" );
		expect( keywordCount( mockPaper, mockResearcherAmpersand ).count ).toBe( 0 );
	} );

	it( "keyword counting is blind to CApiTal LeTteRs.", function() {
		let mockPaper = new Paper( "A string with KeY worD." );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 1 );
	} );

	it( "keyword counting is blind to types of apostrophe.", function() {
		let mockPaper = new Paper( "a string with quotes to match the key'word, even if the quotes differ" );
		expect( keywordCount( mockPaper, mockResearcherApostrophe ).count ).toBe( 1 );
	} );

	it( "counts can count dollar sign as in '$keyword'.", function() {
		let mockPaper = new Paper( "a string with a $keyword" );
		expect( keywordCount( mockPaper, mockResearcherDollarSign ).count ).toBe( 1 );
	} );

	it( "counts a string of text with a keyword in it once, even if the text contains 'key-word' as well.", function() {
		let mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit " );
		expect( keywordCount( mockPaper, mockResearcherKeyWord ).count ).toBe( 2 );
	} );
} );
