var missingArgument = require( "../../js/errors/missingArgument.js" );

var error = new missingArgument( "Error" );

describe( "missing argument error", function(){
	it( "throws an error", function(){
		expect ( error.message ).toBe( "Error" );
		expect ( error.name ).toBe( "MissingArgumentError" );
	});
});
