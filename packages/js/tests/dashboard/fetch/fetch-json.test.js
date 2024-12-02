import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fetchJson } from "../../../src/dashboard/fetch/fetch-json";

describe( "fetchJson", () => {
	beforeAll( () => {
		global.fetch = jest.fn();
	} );

	afterEach( () => {
		global.fetch.mockClear();
	} );

	it( "should wrap fetch", () => {
		global.fetch.mockResolvedValue( {
			ok: true,
			json: jest.fn().mockResolvedValue( "foo" ),
		} );

		const url = "https://example.com/";
		const options = {
			headers: { "Content-Type": "application/json" },
		};

		expect( fetchJson( url, options ) ).resolves.toBe( "foo" );
		expect( fetch ).toHaveBeenCalledWith( url, options );
	} );

	it( "should reject if not ok", () => {
		global.fetch.mockResolvedValue( { ok: false } );

		const url = "https://example.com/";
		const options = {
			headers: { "Content-Type": "application/json" },
		};

		expect( fetchJson( url, options ) ).rejects.toThrow( "not ok" );
		expect( fetch ).toHaveBeenCalledWith( url, options );
	} );

	it( "should reject if errored", () => {
		global.fetch.mockImplementation( () => {
			throw new Error( "foo" );
		} );

		const url = "https://example.com/";
		const options = {
			headers: { "Content-Type": "application/json" },
		};

		expect( fetchJson( url, options ) ).rejects.toThrow( "foo" );
		expect( fetch ).toHaveBeenCalledWith( url, options );
	} );
} );
