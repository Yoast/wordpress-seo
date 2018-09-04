var imageCountFunction = require( "../../src/researches/imageCountInText.js" );
var Paper = require( "../../src/values/Paper" );

describe( "Counts images in an text", function() {
	let imageCount;

	it( "returns object with the imagecount", function() {
		imageCount = imageCountFunction(
			new Paper( "string <img src='http://plaatje' alt='' />" )
		);

		expect( imageCount ).toBe( 1 );

		imageCount = imageCountFunction(
			new Paper( "string" )
		);

		expect( imageCount ).toBe( 0 );
	} );
} );
