import { subscribe } from "@wordpress/data";
import createDomSync from "../../../../src/classic-editor/watchers/helpers/createDomSync";


jest.mock( "@wordpress/data" );

/**
 * Mock debounce, instead of using fake timers
 * because of this bug https://github.com/facebook/jest/issues/3465
 */
jest.mock( "lodash", () => (
	{
		...jest.requireActual( "lodash" ),
		debounce: jest.fn( fn => fn ),
	}
) );

describe( "The createDomSync helper function", () => {
	it( "syncs the store to the DOM", () => {
		const selector = jest.fn();
		const domGet = jest.fn();
		const domSet = jest.fn();

		subscribe.mockImplementation( fn => fn() );

		selector.mockReturnValue( "value from the store" );

		createDomSync( selector, { domGet, domSet }, "cacheKey" );

		expect( domSet ).toBeCalledTimes( 1 );
	} );
	it( "does not sync the store to the DOM when the value is the same as in the DOM", () => {
		const selector = jest.fn();
		const domGet = jest.fn();
		const domSet = jest.fn();

		domGet.mockReturnValue( "same value" );
		subscribe.mockImplementation( fn => fn() );
		selector.mockReturnValue( "same value" );

		createDomSync( selector, { domGet, domSet }, "cacheKey" );

		expect( domSet ).not.toBeCalled();
	} );
	it( "does not sync the store to the DOM when the value is the same as in the cache", () => {
		const selector = jest.fn();
		const domGet = jest.fn();
		const domSet = jest.fn();

		domGet.mockReturnValue( "value from the DOM" );
		subscribe.mockImplementation( fn => fn() );
		selector.mockReturnValue( "value from the store" );

		/*
		  When called multiple times with the same value and cache key, the cache should kick in and the value
		  should only be saved to the DOM once.
		 */
		createDomSync( selector, { domGet, domSet }, "otherCacheKey" );
		createDomSync( selector, { domGet, domSet }, "otherCacheKey" );
		createDomSync( selector, { domGet, domSet }, "otherCacheKey" );

		expect( domSet ).toBeCalledTimes( 1 );
	} );
	it( "syncs an empty string to the DOM when the value is undefined", () => {
		const selector = jest.fn();
		const domGet = jest.fn();
		const domSet = jest.fn();

		domGet.mockReturnValue( "value from the DOM" );
		subscribe.mockImplementation( fn => fn() );
		selector.mockReturnValue( undefined );

		createDomSync( selector, { domGet, domSet }, "cacheKey" );

		expect( domSet ).toBeCalledWith( "" );
	} );
} );
