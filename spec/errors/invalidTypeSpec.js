import InvalidTypeError from "../../src/errors/invalidType";

describe( "Invalid type error", function() {
	it( "has the correct name and message", function() {
		let error = new InvalidTypeError( "Error" );
		expect( error.message ).toBe( "Error" );
		expect( error.name ).toBe( "InvalidTypeError" );
	} );
} );
