const largestKeywordDistance = require( "../../src/researches/largestKeywordDistance.js" );
const Paper = require( "../../src/values/Paper.js" );

describe( "Test for checking the largest percentage of a text without keyword", function() {
	it( "returns the largest distance when that is the distance between two keywords", function() {
		let mockPaper = new Paper( "a text with the keyword in it and then there's some text and then the keyword appears again and the keyword appears one last time", { keyword: "keyword" } );

		expect( largestKeywordDistance( mockPaper ) ).toBe( 41.86046511627907 );
	} );

	it( "returns the largest distance when that is the distance between the beginning of the text and the first keyword", function() {
		let mockPaper = new Paper( "a lot of text before the first keyword and again the keyword", { keyword: "keyword" } );

		expect( largestKeywordDistance( mockPaper ) ).toBe( 51.66666666666667 );
	} );

	it( "returns the largest distance when that is the distance between the last keyword and the end of the text", function() {
		let mockPaper = new Paper( "a keyword and again the keyword and then there's a lot of text after that", { keyword: "keyword" } );

		expect( largestKeywordDistance( mockPaper ) ).toBe( 67.12328767123287 );
	} );

	it( "returns the largest distance when there is only one keyword and the largest distance is between the keyword and the beginning of the text", function() {
		let mockPaper = new Paper( "this text has only one keyword", { keyword: "keyword" } );
		expect( largestKeywordDistance( mockPaper ) ).toBe( 76.66666666666667 );
	} );

	it( "returns the largest distance when there is only one keyword and the largest distance is between the keyword and the end of the text", function() {
		let mockPaper = new Paper( "this is the only keyword in a very long text with lots of words", { keyword: "keyword" } );

		expect( largestKeywordDistance( mockPaper ) ).toBe( 73.01587301587301 );
	} );
} );
