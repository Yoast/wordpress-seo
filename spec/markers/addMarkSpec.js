const addMarkSingleWord = require( "../../src/markers/addMarkSingleWord.js" );

describe( "addMark", function() {
	it( "should mark an empty text", function() {
		expect( addMarkSingleWord( "" ) ).toBe( "<yoastmark class='yoast-text-mark'></yoastmark>" );
	} );

	it( "should mark a normal text", function() {
		expect( addMarkSingleWord( "A piece of text" ) ).toBe( "<yoastmark class='yoast-text-mark'>A piece of text</yoastmark>" );
	} );

	it( "should mark a text that starts with word boundaries", function() {
		expect( addMarkSingleWord( "> ()A piece of text" ) ).toBe( "> ()".concat( "<yoastmark class='yoast-text-mark'>A piece of text</yoastmark>" ) );
	} );
} );
