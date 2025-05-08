import { describe, expect, it } from "@jest/globals";
import { fetchJson } from "../../src/fetch/fetch-json";
import { getItem, setItem } from "../../src/services/cache";
import { RemoteCachedDataProvider } from "../../src/services/remote-cached-data-provider";

jest.mock( "../../src/services/cache", () => ( {
	getItem: jest.fn(),
	setItem: jest.fn(),
} ) );
jest.mock( "../../src/fetch/fetch-json" );

describe( "RemoteCachedDataProvider", () => {
	beforeAll( () => {
		fetchJson.mockImplementation( () => {
			return Promise.resolve( "result" );
		} );
	} );

	beforeEach( () => {
		fetchJson.mockClear();
	} );

	test.each( [
		[ "a TTL equal to zero", 0 ],
		[ "a negative TTL", -1 ],
		[ "an invalid number TTL", NaN ],
	] )( "should throw an error when instantiated with %s", ( _, ttl ) => {
		expect( () => {
			new RemoteCachedDataProvider( {}, "storagePrefix", "yoastVersion", ttl );
		} ).toThrow( "The TTL provided must be a positive integer." );
	} );

	it( "should instantiate successfully with a valid TTL", () => {
		const provider = new RemoteCachedDataProvider( {}, "storagePrefix", "yoastVersion", 3600 );
		expect( provider ).toBeInstanceOf( RemoteCachedDataProvider );
	} );

	it( "should return cached data if available", async() => {
		getItem.mockReturnValue( { cacheHit: true, value: { data: "cachedData" } } );
		const url = "https://example.com/";
		const options = {
			headers: { "Content-Type": "application/json" },
			options: { widget: "testWidget" },
		};

		const provider = new RemoteCachedDataProvider( {}, "storagePrefix", "yoastVersion", 3600 );
		const result = await provider.fetchJson( url, options );

		expect( getItem ).toHaveBeenCalledWith( "yoastseo_yoastVersion_storagePrefix_testWidget" );
		expect( result ).toEqual( { data: "cachedData" } );
		expect( setItem ).not.toHaveBeenCalled();
		expect( fetchJson ).not.toHaveBeenCalled();
	} );

	it( "should fetch data and cache it if not in cache", async() => {
		getItem.mockReturnValue( { cacheHit: false } );
		const url = "https://example.com/";
		const options = {
			headers: { "Content-Type": "application/json" },
			options: { widget: "testWidget" },
		};

		const provider = new RemoteCachedDataProvider( {}, "storagePrefix", "yoastVersion", 3600 );

		const result = await provider.fetchJson( url, options );

		expect( getItem ).toHaveBeenCalledWith( "yoastseo_yoastVersion_storagePrefix_testWidget" );
		expect( fetchJson ).toHaveBeenCalledTimes( 1 );
		expect( result ).toEqual( "result" );
		expect( setItem ).toHaveBeenCalledWith(
			"yoastseo_yoastVersion_storagePrefix_testWidget",
			"result",
			{ ttl: 3600 }
		);
	} );
} );
