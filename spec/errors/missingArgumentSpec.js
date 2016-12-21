import MissingArgumentError from "../../js/errors/missingArgument.js";

describe( "missing argument error", function() {
	let error = new MissingArgumentError( "Error" );
	it( "has the correct name and message", function() {
		expect ( error.message ).toBe( "Error" );
		expect ( error.name ).toBe( "MissingArgumentError" );
	} );
} );
