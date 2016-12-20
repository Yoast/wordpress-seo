var invalidType = require( "../../js/errors/invalidType.js" );

var error = new invalidType( "Error" );

describe( "Invalid type error", function(){
	it( "throws an error", function(){
		expect ( error.message ).toBe( "Error" );
		expect ( error.name ).toBe( "InvalidTypeError" );
	});
});
