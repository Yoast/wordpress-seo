import getSubheadingTexts from "../../../../src/languageProcessing/helpers/html/getSubheadingTexts.js";

let result;
describe( "A function to get all text blocks from subheadings", function() {
	it( "returns the subheading and the following text from a text with only one subheading", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text" );
		expect( result.foundSubheadings[ 0 ].subheading ).toEqual( "<h2>this is text</h2>" );
		expect( result.foundSubheadings[ 0 ].text ).toEqual( "this is subheading text" );
		expect( result.foundSubheadings[ 0 ].index ).toEqual( 0 );
	} );

	it( "returns the subheadings and the following texts from a text with two subheadings", function() {
		result = getSubheadingTexts( "<h2>this is text</h2>this is subheading text<h2>more</h2>this is more text" );

		expect( result.foundSubheadings[ 0 ].subheading ).toEqual( "<h2>this is text</h2>" );
		expect( result.foundSubheadings[ 0 ].text ).toEqual( "this is subheading text" );
		expect( result.foundSubheadings[ 0 ].index ).toEqual( 0 );
		expect( result.foundSubheadings[ 1 ].subheading ).toEqual( "<h2>more</h2>" );
		expect( result.foundSubheadings[ 1 ].text ).toEqual( "this is more text" );
		expect( result.foundSubheadings[ 1 ].index ).toEqual( 44 );
	} );

	it( "returns the subheadings and the following texts from a text with two subheadings" +
		"and a text preceding the first subheading", function() {
		result = getSubheadingTexts( "this is some text before the first subheading<h2>fist subheading</h2>more text after the first subheading" +
			"<h2>second subheading</h2>this is the text after the second subheading." );

		expect( result.foundSubheadings[ 0 ].subheading ).toEqual( "<h2>fist subheading</h2>" );
		expect( result.foundSubheadings[ 0 ].text ).toEqual( "more text after the first subheading" );
		expect( result.foundSubheadings[ 0 ].index ).toEqual( 45 );
		expect( result.foundSubheadings[ 1 ].subheading ).toEqual( "<h2>second subheading</h2>" );
		expect( result.foundSubheadings[ 1 ].text ).toEqual( "this is the text after the second subheading." );
		expect( result.foundSubheadings[ 1 ].index ).toEqual( 105 );
	} );

	it( "returns the original text and an empty array of found subheadings if no subheading is found", function() {
		result = getSubheadingTexts( "this is text" );
		expect( result.foundSubheadings ).toEqual( [] );
		expect( result.text ).toEqual( "this is text" );
	} );
} );
