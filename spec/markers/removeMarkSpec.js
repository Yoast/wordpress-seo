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
});
