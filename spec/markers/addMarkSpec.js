var addMark = require( "../../js/markers/addMark.js" );

describe( 'addMark', function() {
	it( "should mark an empty text", function() {
		expect( addMark( "" ) ).toBe( "<yoastmark class='yoast-text-mark'></yoastmark>" );
	});

	it( "should mark a normal text", function() {
		expect( addMark( "A piece of text" ) ).toBe( "<yoastmark class='yoast-text-mark'>A piece of text</yoastmark>" );
	});
});
