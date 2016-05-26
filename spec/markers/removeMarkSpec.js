var removeMarks = require( "../../js/markers/removeMarks.js" );

describe( "removeMarks", function() {
	it( "should not touch an empty text", function() {
		expect( removeMarks( "" ) ).toBe( "" );
	});

	it( "should remove one mark from a text", function() {
		expect( removeMarks( "<yoastmark class='yoast-text-mark'>A text</yoastmark>" ) ).toBe( "A text" );
	});

	it( "should remove multiple marks from a text", function() {
		var input = "Another <yoastmark class='yoast-text-mark'>text</yoastmark> with another <yoastmark class='yoast-text-mark'>mark.</yoastmark>";

		expect( removeMarks( input ) ).toBe( "Another text with another mark." );
	});

	it( "should not touch other HTML elements", function() {
		var input = "Another <yoastmark class='yoast-text-mark'>text</yoastmark> with another <span>mark.</span>";

		expect( removeMarks( input ) ).toBe( "Another text with another <span>mark.</span>" );
	});

	it( "should support arbitrary HTML attributes", function() {
		var input = "Another <yoastmark class='some-class yoast-text-mark' style='border-bottom: 1px solid red'>Marked</yoastmark>";

		expect( removeMarks( input  ) ) .toBe( "Another Marked" );
	});

	it( "should support different quote styles", function() {
		var input = 'Marked <yoastmark class="yoast-text-mark">marked</yoastmark>';

		expect( removeMarks( input ) ).toBe( "Marked marked" );
	});

	it( "should remove marks without HTML attributes", function() {
		var input = "Marked <yoastmark>marked</yoastmark>";

		expect( removeMarks( input ) ).toBe( "Marked marked" );
	});
});
