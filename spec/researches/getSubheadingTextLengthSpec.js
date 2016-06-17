var subHeadingTextLength = require( "../../js/researches/getSubheadingTextLengths.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "gets the length of subheadings", function() {
	it( "returns an array with lengths", function() {
		var mockPaper = new Paper( "<h1>test</h1>one two three" );
		expect( subHeadingTextLength( mockPaper )[ 0 ].wordCount ).toBe( 3 );
	} );

	it( "returns an empty array", function() {
		var mockPaper = new Paper( "one two three" );
		expect( subHeadingTextLength( mockPaper).length ).toBe( 0 );
	} );

	it( "returns an array with 2 entries", function() {
		var mockPaper = new Paper( "<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		expect( subHeadingTextLength( mockPaper)[ 0 ].wordCount ).toBe( 2 );
		expect( subHeadingTextLength( mockPaper)[ 1 ].wordCount ).toBe( 10 );
		expect( subHeadingTextLength( mockPaper).length ).toBe( 2 );
	} );

	it( "returns an array with 2 entries", function() {
		var mockPaper = new Paper( "some text<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		expect( subHeadingTextLength( mockPaper)[ 0 ].wordCount ).toBe( 2 );
		expect( subHeadingTextLength( mockPaper)[ 1 ].wordCount ).toBe( 10 );
		expect( subHeadingTextLength( mockPaper).length ).toBe( 2 );
	} );
} );

