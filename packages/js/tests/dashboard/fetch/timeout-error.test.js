import { describe, expect, it } from "@jest/globals";
import { TimeoutError } from "../../../src/dashboard/fetch/timeout-error";

describe( "TimeoutError", () => {
	it( "should have the correct name", () => {
		expect( new TimeoutError( "message" ).name ).toBe( "TimeoutError" );
	} );

	it( "should have the given message", () => {
		expect( new TimeoutError( "message" ).message ).toBe( "message" );
	} );
} );
