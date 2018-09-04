/* global describe it expect */
import getTopicDensity from "../../src/researches/getTopicDensity.js";

import Paper from "../../src/values/Paper.js";
describe( "Test for counting the keyword and synonyms in a text", function() {
	it( "returns topic count equal to keyword count if only keyword is supplied", function() {
		let mockPaper = new Paper( "a string of text with the keyword in it.", { keyword: "keyword" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 11.11111111111111111 );
		mockPaper = new Paper( "a string of text without the keyword in it.", { keyword: "empty" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz spitzen.", { keyword: "äöüß" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing.", { keyword: "key-word" } );
		expect( getTopicDensity( mockPaper  ) ).toBe( 10 );
		mockPaper = new Paper( "a string of text with the beautiful kapaklı in it.", { keyword: "kapaklı" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "a string of text with the beautiful key-word in it.", { keyword: "key-word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "a string of text with the beautiful key_word in it.", { keyword: "key_word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "a string of text with the beautiful key_word in it.", { keyword: "key word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key-word in it.", { keyword: "key word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the beautiful key&word in it.", { keyword: "key&word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "<img src='http://image.com/image.png'>", { keyword: "key&word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "This is a nice string with a keyword keyword keyword.", { keyword: "keyword" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "a string of text with the beautiful Keyword in it.", { keyword: "keyword" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
		mockPaper = new Paper( "a string of text with the Key word in it.", { keyword: "key word" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
	} );

	it( "returns topic count if both keyword and synonyms are supplied", function() {
		let mockPaper = new Paper( "Site and website are essentially the same, so to say.", { keyword: "site", synonyms: "website" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "Site and website are essentially the same, so to say.", { keyword: "website", synonyms: "site" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "Site, web site and website are essentially the same, really.", { keyword: "website", synonyms: "site" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 30 );
		mockPaper = new Paper( "Site and website are essentially the same, so to say.", { keyword: "keyword", synonyms: "anotherKeyword" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "Blog is essentially a website.", { keyword: "website", synonyms: "site" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz spitzen. ", { keyword: "äöüß", synonyms: "spitzen" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "Another way to write key word is key-word or keyword.", { keyword: "key word", synonyms: "key-word, keyword" } );
		expect( getTopicDensity( mockPaper  ) ).toBe( 30 );
		mockPaper = new Paper( "a string of text with the beautiful kapaklı in it.", { keyword: "kapaklı", synonyms: "kapaklı" } );
		expect( getTopicDensity( mockPaper ) ).toBe( 10 );
	} );
} );
