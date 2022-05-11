// Dependencies
import { createExceptionHandler, isSameOrigin, createBlobURL, createWorkerFallback, createWorker } from "../../src/worker/createWorker";

/**
 * JSDom does not provide full support for Blob, so we have to provide a polyfill
 * to be able to check the contents of blobs.
 */
import "blob-polyfill";

describe( "The createWorker module", () => {
	describe( "checks createExceptionHandler function", () => {
		it( "outputs an error message containing the inputted string ", () => {
			const exceptionMessage = createExceptionHandler( "poffertjes" );
			expect( exceptionMessage ).toContain( "poffertjes" );
		} );
	} );

	describe( "checks isSameOrigin function", () => {
		it( "checks if two different URLS from different sites have the same origin (hostname, port, protocol)", () => {
			const sameURL = isSameOrigin( "https://jestjs.io/docs/mock-functions", "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin" );
			expect( sameURL ).toBeFalsy();
		} );

		it( "checks if two URLS of different posts on the same site have the same origin (hostname, port, protocol)", () => {
			// eslint-disable-next-line max-len
			const sameURL = isSameOrigin( "https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function", "https://stackoverflow.com/questions/41885841/how-can-i-mock-the-javascript-window-object-using-jest" );
			expect( sameURL ).toBeTruthy();
		} );

		it( "checks if two URLS with different scheme (http vs https) have the same origin (hostname, port, protocol/ scheme)", () => {
			const sameURL = isSameOrigin( "http://jestjs.io/docs/mock-functions", "https://jestjs.io/docs/mock-functions" );
			expect( sameURL ).toBeFalsy();
		} );
	} );

	describe( "checks createBlobURL function", () => {
		it( "creates a blob", async() => {
			global.URL.createObjectURL = jest.fn();
			createBlobURL( "https://example.org/some/code.js" );
			expect( global.URL.createObjectURL ).toBeCalledTimes( 1 );

			const argumentsOfLastCall = global.URL.createObjectURL.mock.calls[ 0 ];
			const blob = argumentsOfLastCall[ 0 ];

			expect( blob.type ).toEqual( "application/javascript" );

			const text = await blob.text();

			expect( text ).toContain( "importScripts('https://example.org/some/code.js');" );
			expect( text ).toContain( "try" );
			expect( text ).toContain( "catch" );
		} );

		it( "uses the webkitURL as a fallback when URL is not available", async() => {
			const URL = global.URL;

			global.URL = undefined;

			global.webkitURL = jest.fn();
			global.webkitURL.createObjectURL = jest.fn();
			createBlobURL( "https://example.org/some/code.js" );
			expect( global.webkitURL.createObjectURL ).toBeCalledTimes( 1 );

			global.URL = URL;
		} );

		it( "falls back to the BlobBuilder when creating a Blob fails", async() => {
			global.URL.createObjectURL = jest.fn();
			global.Blob = jest.fn( () => { throw "An error!"; } );

			const append = jest.fn();
			const getBlob = jest.fn();

			global.BlobBuilder = jest.fn( () => (
				{
					append,
					getBlob,
				}
			) );

			createBlobURL( "https://example.org/some/code.js" );

			expect( global.URL.createObjectURL ).toBeCalledTimes( 1 );

			const text = append.mock.calls[ 0 ][ 0 ];

			expect( text ).toContain( "importScripts('https://example.org/some/code.js');" );
			expect( text ).toContain( "try" );
			expect( text ).toContain( "catch" );

			expect( getBlob ).toHaveBeenCalledWith( "application/javascript" );
		} );
	} );

	describe( "The createWorkerFallback function", () => {
		it( "creates a worker fallback", () => {
			global.URL.createObjectURL = jest.fn();
			global.Worker = jest.fn();

			global.URL.createObjectURL.mockReturnValue( "https://example.org/url/to/a/blob" );

			createWorkerFallback( "https://example.org/some/code.js" );

			expect( global.Worker ).toHaveBeenCalledWith( "https://example.org/url/to/a/blob" );
		} );
	} );

	describe( "The createWorker function", () => {
		it( "creates a worker", () => {
			global.URL.createObjectURL = jest.fn();
			global.Worker = jest.fn();

			const worker = createWorker( "http://localhost/some/code.js" );

			expect( worker ).toBeInstanceOf( global.Worker );
		} );

		it( "creates a worker using the fallback when the worker script does not have the same origin", () => {
			global.URL.createObjectURL = jest.fn();
			global.Worker = jest.fn();

			const worker = createWorker( "http://example.org/some/code.js" );

			expect( worker ).toBeInstanceOf( global.Worker );
		} );

		it( "creates a worker using the fallback when the worker script cannot be created", () => {
			global.URL.createObjectURL = jest.fn();
			global.Worker = jest.fn( url => {
				if ( url === "http://localhost/some/code.js" ) {
					throw "error!";
				}
			} );

			const worker = createWorker( "http://localhost/some/code.js" );

			expect( worker ).toBeInstanceOf( global.Worker );
		} );

		it( "throws an error when the worker script cannot be created at all", () => {
			global.URL.createObjectURL = jest.fn();
			global.Worker = jest.fn( url => {
				throw "error!";
			} );

			expect( () => { createWorker( "http://localhost/some/code.js" ) } ).toThrowError();
		} );
	} );
} );

