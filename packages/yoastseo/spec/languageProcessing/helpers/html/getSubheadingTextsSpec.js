import getSubheadingTexts from "../../../../src/languageProcessing/helpers/html/getSubheadingTexts.js";

let result;
describe( "A function to get all text blocks from subheadings", function() {
	it( "returns 1 block of text", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text" );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).not.toContain( "this is text" );
	} );

	it( "returns 2 blocks of text following 2 subheadings", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text<h2>more</h2>this is more text" );

		expect( result.length ).toBe( 2 );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).toContain( "this is more text" );
	} );

	it( "returns 2 blocks of text, one outside subheadings, one following a subheading", function() {
		result = getSubheadingTexts( "this is some text before the first subheading<h2>fist subheading</h2>" +
			"more text after the first subheading<h2>second subheading</h2>test test" );

		expect( result ).toEqual( [
			{
				subheading: "<h2>fist subheading</h2>",
				text: "more text after the first subheading",
			},
			{ subheading: "<h2>second subheading</h2>",
				text: "test test" },
		]  );
	} );

	it( "returns 2 blocks of text, one outside subheadings, one following a subheading", function() {
		result = getSubheadingTexts( "this is some text before the first subheading<h2>fist subheading</h2>more text after the first subheading" );

		expect( result.length ).toBe( 2 );
		expect( result ).toContain( "this is some text before the first subheading" );
		expect( result ).toContain( "more text after the first subheading" );
	} );

	it( "returns 1 block of text, since there are no subheadings", function() {
		result = getSubheadingTexts( "this is text" );
		expect( result.length ).toBe( 1 );
	} );

	it( "returns 1 block of text, using | character", function() {
		result = getSubheadingTexts( "<h2>this | is | text</h2>this |is| subheading text" );
		expect( result.length ).toBe( 1 );
		expect( result ).toContain( "this is subheading text" );
		expect( result ).not.toContain( "this is text" );
	} );
} );
