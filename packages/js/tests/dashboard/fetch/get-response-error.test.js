import { describe, expect, it } from "@jest/globals";
import { getResponseError } from "../../../src/dashboard/fetch/get-response-error";

describe( "getResponseError", () => {
	it.each( [
		[ 400, "Error", "not ok" ],
		[ 404, "Error", "not ok" ],
		[ 408, "TimeoutError", "request timed out" ],
		[ 500, "Error", "not ok" ],
	] )( "status %s should return %s with the message: %s", ( status, name, message ) => {
		const actual = getResponseError( { status } );
		expect( actual.name ).toBe( name );
		expect( actual.message ).toBe( message );
	} );
} );
