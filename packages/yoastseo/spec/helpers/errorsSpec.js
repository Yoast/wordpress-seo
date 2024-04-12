import { showTrace } from "../../src/helpers/errors";

describe( "showTrace", function() {
	beforeEach( function() {
		jest.spyOn( console, "trace" ).mockImplementation();
	} );

	it( "should send a message to console.trace", function() {
		showTrace( "message" );

		expect( console.trace ).toHaveBeenCalledWith( "message" );
	} );

	it( "should default to an empty message", function() {
		showTrace();

		expect( console.trace ).toHaveBeenCalledWith( "" );
	} );
} );
