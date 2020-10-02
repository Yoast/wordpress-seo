import { showTrace } from "../../src/languages/legacy/helpers/errors";

describe( "showTrace", function() {
	beforeEach( function() {
		spyOn( console, "trace" );
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
