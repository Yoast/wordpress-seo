import { describe, expect, it, jest } from "@jest/globals";
import { useFetch } from "../../../src/dashboard/fetch/use-fetch";
import { renderHook, waitFor } from "../../test-utils";

describe( "useFetch", () => {
	it( "should fetch data", async() => {
		const fetch = jest.fn( () => Promise.resolve( "data" ) );
		const { result } = renderHook( () => useFetch( {
			dependencies: [],
			url: "https://example.com",
			options: {},
			doFetch: fetch,
			fetchDelay: 0,
		} ) );

		expect( result.current.isPending ).toBe( true );
		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( fetch ).toHaveBeenCalledTimes( 1 );
		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com" );
		expect( result.current.data ).toEqual( "data" );
		expect( result.current.error ).toBeUndefined();
	} );

	it( "should abort the fetch on unmount", async() => {
		// Create fetch with timeout, so that we can test the abort.
		const fetch = jest.fn( () => new Promise( ( resolve ) => {
			setTimeout( () => resolve( "data" ), 1000 );
		} ) );
		const { result, unmount } = renderHook( () => useFetch( {
			dependencies: [],
			url: "https://example.com",
			options: {},
			doFetch: fetch,
			fetchDelay: 0,
		} ) );

		expect( result.current.isPending ).toBe( true );
		// Wait for the fetch to be called.
		await waitFor( () => expect( fetch ).toHaveBeenCalledTimes( 1 ) );
		unmount();

		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com" );
		expect( fetch.mock.calls[ 0 ][ 1 ].signal.aborted ).toBe( true );
		// Abort errors should not set the error state.
		expect( result.current.error ).toBeUndefined();
		// The other state is not changed due to the unmount.
		expect( result.current.data ).toBeUndefined();
		expect( result.current.isPending ).toBe( true );
	} );

	it( "should abort the fetch on dependencies change", async() => {
		// Create fetch with timeout, so that we can test the abort.
		const fetch = jest.fn( () => new Promise( ( resolve ) => {
			setTimeout( () => resolve( "data" ), 1000 );
		} ) );
		const { result, rerender } = renderHook( ( { url } ) => useFetch( {
			dependencies: [ url ],
			url,
			options: {},
			doFetch: fetch,
			fetchDelay: 0,
		} ), { initialProps: { url: "https://example.com" } } );

		expect( result.current.isPending ).toBe( true );
		// Wait for the fetch to be called.
		await waitFor( () => expect( fetch ).toHaveBeenCalledTimes( 1 ) );

		// Rerender with a new URL to trigger the dependency change.
		rerender( { url: "https://example.com/foo" } );
		await waitFor( () => expect( fetch ).toHaveBeenCalledTimes( 2 ) );

		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com" );
		expect( fetch.mock.calls[ 0 ][ 1 ].signal.aborted ).toBe( true );
		expect( fetch.mock.calls[ 1 ][ 0 ] ).toBe( "https://example.com/foo" );
		// Abort errors should not set the error state.
		expect( result.current.error ).toBeUndefined();
		// The other state is not changed due to the unmount.
		expect( result.current.data ).toBeUndefined();
		expect( result.current.isPending ).toBe( true );
	} );

	it( "should handle fetch errors", async() => {
		const fetch = jest.fn( () => Promise.reject( new Error( "error" ) ) );
		const { result } = renderHook( () => useFetch( {
			dependencies: [],
			url: "https://example.com",
			options: {},
			doFetch: fetch,
			fetchDelay: 0,
		} ) );

		expect( result.current.isPending ).toBe( true );
		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( fetch ).toHaveBeenCalledTimes( 1 );
		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com" );
		expect( result.current.data ).toBeUndefined();
		expect( result.current.error ).toEqual( new Error( "error" ) );
	} );

	it( "should prepare data", async() => {
		const fetch = jest.fn( () => Promise.resolve( [ { id: 1, name: "name" } ] ) );
		const { result } = renderHook( () => useFetch( {
			dependencies: [],
			url: "https://example.com",
			options: {},
			doFetch: fetch,
			fetchDelay: 0,
			prepareData: ( entry ) => entry.map( ( { id, name } ) => ( { name: String( id ), label: name } ) ),
		} ) );

		expect( result.current.isPending ).toBe( true );
		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( fetch ).toHaveBeenCalledTimes( 1 );
		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com" );
		expect( result.current.data ).toEqual( [ { name: "1", label: "name" } ] );
		expect( result.current.error ).toBeUndefined();
	} );

	it( "should debounce fetches", async() => {
		const fetch = jest.fn()
			.mockImplementationOnce( () => Promise.resolve( "one" ) )
			.mockImplementationOnce( () => Promise.resolve( "two" ) )
			.mockImplementationOnce( () => Promise.resolve( "three" ) );
		const { result, rerender } = renderHook( ( { url } ) => useFetch( {
			dependencies: [ url ],
			url,
			options: {},
			doFetch: fetch,
			fetchDelay: 100,
		} ), { initialProps: { url: "https://example.com" } } );

		expect( result.current.isPending ).toBe( true );
		// Re-render multiple times to mimic multiple calls.
		rerender( { url: "https://example.com/foo" } );
		rerender( { url: "https://example.com/bar" } );

		await waitFor( () => expect( result.current.isPending ).toBe( false ) );

		expect( fetch ).toHaveBeenCalledTimes( 1 );
		// Note this should be the URL for the last call, because the previous ones are debounced.
		expect( fetch.mock.calls[ 0 ][ 0 ] ).toBe( "https://example.com/bar" );
		// Note this should be the first call result, because we only want one call.
		expect( result.current.data ).toBe( "one" );
		expect( result.current.error ).toBeUndefined();
	} );
} );
