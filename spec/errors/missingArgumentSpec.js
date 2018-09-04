import MissingArgumentError from "../../src/errors/missingArgument.js";

describe( "missing argument error", function() {
	it( "has the correct name and message", function() {
		let error = new MissingArgumentError( "Error" );
		expect( error.message ).toBe( "Error" );
		expect( error.name ).toBe( "MissingArgumentError" );
	} );
} );
