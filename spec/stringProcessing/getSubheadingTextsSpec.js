var getSubheadingTexts = require( "../../js/stringProcessing/getSubheadingTexts.js" );

var result;
describe( "A function to get all text blocks from subheadings", function(){

	it( "returns 1 block of text", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text" );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).not.toContain( "this is text" );
	} );

	it( "returns 2 blocks of text", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text<h1>more</h1>this is more text" );

		expect( result.length ).toBe( 2 );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).toContain( "this is more text" );
	} );
	it( "returns empty array, since there are no subheadings", function() {
		result = getSubheadingTexts( "this is text" );
		expect( result.length ).toBe( 0 );
	} );

	it( "returns 1 block of text, using | character", function() {
		result = getSubheadingTexts( "<h2>this | is | text</h2>this |is| subheading text" );
		expect( result.length ).toBe ( 1 );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).not.toContain( "this is text" );
	} );
} );
