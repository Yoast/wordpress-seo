/* global describe it expect */
const topicCount = require( "../../js/researches/topicCount.js" );
const Paper = require( "../../js/values/Paper.js" );
// todo: change this spec as soon as the proper synonyms interface is ready.
describe( "Test for counting the keyword and synonyms in a text", function() {
	it( "returns topic count equal to keyword count if only keyword is supplied", function() {
		let mockPaper = new Paper( "a string of text with the keyword in it.", { keyword: "keyword" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text without the keyword in it.", { keyword: "empty" } );
		expect( topicCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.", { keyword: "äöüß" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit ", { keyword: "key-word" } );
		expect( topicCount( mockPaper  ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the kapaklı in it.", { keyword: "kapaklı" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key-word in it.", { keyword: "key-word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key_word in it.", { keyword: "key_word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key_word in it.", { keyword: "key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key-word in it.", { keyword: "key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key&word in it.", { keyword: "key&word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "<img src='http://image.com/image.png'>", { keyword: "key&word" } );
		expect( topicCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "This is a nice string with a keyword keyword keyword.", { keyword: "keyword" } );
		expect( topicCount( mockPaper ).count ).toBe( 3 );
		mockPaper = new Paper( "a string of text with the Keyword in it.", { keyword: "keyword" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the Key word in it.", { keyword: "key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the Key Word in it.", { keyword: "key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the KEY WORD in it.", { keyword: "key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the keyword in it.", { keyword: "Keyword" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key word in it.", { keyword: "Key word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key word in it.", { keyword: "Key Word" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key word in it.", { keyword: "KEY WORD" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
	} );

	it( "returns topic count if both keyword and synonyms are supplied", function() {
		let mockPaper = new Paper( "Site and website are essentially the same.", { keyword: "site, website" } );
		expect( topicCount( mockPaper ).count ).toBe( 2 );
		mockPaper = new Paper( "Site and website are essentially the same.", { keyword: "website, site" } );
		expect( topicCount( mockPaper ).count ).toBe( 2 );
		mockPaper = new Paper( "Site and website are essentially the same.", { keyword: "keyword, anotherKeyword" } );
		expect( topicCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "Blog is a website", { keyword: "website, site" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", { keyword: "äöüß, spitzen" } );
		expect( topicCount( mockPaper ).count ).toBe( 2 );
		mockPaper = new Paper( "Another way to write key word is key-word or keyword.", { keyword: "key word, key-word, keyword" } );
		expect( topicCount( mockPaper  ).count ).toBe( 3 );
		mockPaper = new Paper( "a string of text with the kapaklı in it.", { keyword: "kapaklı" } );
		expect( topicCount( mockPaper ).count ).toBe( 1 );
	} );
} );
