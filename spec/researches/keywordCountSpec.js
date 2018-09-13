/* global describe it expect */
import keywordCount from "../../src/researches/keywordCount.js";

import Paper from "../../src/values/Paper.js";

describe( "Test for counting the keyword in a text", function() {
	it( "returns keyword count", function() {
		let mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%", { keyword: "keyword" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text without the keyword in it, density should be 0%", { keyword: "empty" } );
		expect( keywordCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", { keyword: "äöüß" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit ", { keyword: "key-word" } );
		expect( keywordCount( mockPaper  ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the kapaklı in it, density should be 7.7%", { keyword: "kapaklı" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 7.7%", { keyword: "key-word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 7.7%", { keyword: "key_word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 0.0%", { keyword: "key word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 0.0%", { keyword: "key word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key&word in it, density should be 7.7%", { keyword: "key&word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "<img src='http://image.com/image.png'>", { keyword: "key&word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 0 );
		// Consecutive keywords are skipped, so this will match 2 times.
		mockPaper = new Paper( "This is a nice string with a keyword keyword keyword.", { keyword: "keyword" } );
		expect( keywordCount( mockPaper ).count ).toBe( 2 );
		mockPaper = new Paper( "a string of text with the $keyword in it, density should be 7.7%", { keyword: "$keyword" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the Keyword in it, density should be 7.7%", { keyword: "keyword" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string of text with the Key word in it, density should be 7.14%", { keyword: "key word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
		mockPaper = new Paper( "a string with quotes to match the key'word, even if the quotes differ", { keyword: "key’word" } );
		expect( keywordCount( mockPaper ).count ).toBe( 1 );
	} );
} );
