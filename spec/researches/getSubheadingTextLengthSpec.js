const subHeadingTextLength = require( "../../src/researches/getSubheadingTextLengths.js" );
const Paper = require( "../../src/values/Paper.js" );

describe( "gets the length of text segments", function() {
	it( "returns an array with lengths for a text with one subheading", function() {
		const mockPaper = new Paper( "<h1>test</h1>one two three" );
		expect( subHeadingTextLength( mockPaper )[ 0 ].wordCount ).toBe( 3 );
	} );

	it( "returns an array with text length (1 value) for a text without subheadings", function() {
		const mockPaper = new Paper( "one two three" );
		expect( subHeadingTextLength( mockPaper ).length ).toBe( 1 );
	} );

	it( "returns an array with 2 entries for a text with two subheadings and two text segments", function() {
		const mockPaper = new Paper( "<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		expect( subHeadingTextLength( mockPaper )[ 0 ].wordCount ).toBe( 2 );
		expect( subHeadingTextLength( mockPaper )[ 1 ].wordCount ).toBe( 10 );
		expect( subHeadingTextLength( mockPaper ).length ).toBe( 2 );
	} );

	it( "returns an array with 3 entries for a text with two subheadings, two text segments, and one introductory segment", function() {
		const mockPaper = new Paper( "some text<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		expect( subHeadingTextLength( mockPaper )[ 0 ].wordCount ).toBe( 2 );
		expect( subHeadingTextLength( mockPaper )[ 1 ].wordCount ).toBe( 2 );
		expect( subHeadingTextLength( mockPaper )[ 2 ].wordCount ).toBe( 10 );
		expect( subHeadingTextLength( mockPaper ).length ).toBe( 3 );
	} );
} );
