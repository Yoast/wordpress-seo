var imageCountFunction = require( "../../js/analyses/imageCount.js" );
var imageCount;

describe( "Counts images in an text", function(){
	it( "returns object with the imagecount", function(){
		imageCount = imageCountFunction( "string <img src='http://plaatje' alt='keyword' />", "keyword" );
		expect( imageCount.altKeyword ).toBe( 1 );
		expect( imageCount.total ).toBe( 1 );
		expect( imageCount.noAlt ).toBe( 0 );

		imageCount = imageCountFunction( "string <img src='http://plaatje' alt='keyword' />", "" );
		expect( imageCount.noAlt ).toBe( 0 );
		expect( imageCount.altNaKeyword ).toBe( 1 );
	});
});
