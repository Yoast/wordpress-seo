// Dependencies
import { createExceptionHandler, isSameOrigin, createBlobURL } from "../../src/worker/createWorker";

describe( "checks createExceptionHandler function", () => {
	it( "outputs an error message containing the inputted string ", () => {
		const exceptionMessage = createExceptionHandler( "dogs" );
		expect( exceptionMessage ).toContain( "dogs" );
	} );
} );

describe( "checks isSameOrigin function", () => {
	// Include more tests with different URLs.
	it( "checks if two different URLS have the same origin (hostname, port, protocol)", () => {
		const sameURL = isSameOrigin( "https://jestjs.io/docs/mock-functions", "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin" );
		expect( sameURL ).toBeFalsy();
	} );

	it( "checks if two URLS of different posts on the same site have the same origin (hostname, port, protocol)", () => {
		// eslint-disable-next-line max-len
		const sameURL = isSameOrigin( "https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function", "https://stackoverflow.com/questions/41885841/how-can-i-mock-the-javascript-window-object-using-jest" );
		expect( sameURL ).toBeTruthy();
	} );
} );

describe( "checks createBlobURL function", () => {
	it( "does something", () => {
		global.URL.createObjectURL = jest.fn();
		createBlobURL( "dogs" );
		expect( global.URL.createObjectURL ).toBeCalledTimes( 1 );
		const blob = new Blob( [ "test" ] );
		expect( global.URL.createObjectURL ).toBeCalledWith( blob );
		expect( blob ).toBeInstanceOf( Blob );

		/*
		Const someTestValue = "DOGS";
		const blobScript = createExceptionHandler( createBlobScript( someTestValue ) );

		let blob;
		const URL = window.URL || window.webkitURL;
		try {
			blob = new Blob( [ blobScript ], { type: "application/javascript" } );
		} catch ( e1 ) {
			const blobBuilder = new BlobBuilder();
			blobBuilder.append( blobScript );
			blob = blobBuilder.getBlob( "application/javascript" );
		}
		const urlOut = window.URL.createObjectURL( blob );
		const supposedScript = fetch( urlOut ).then( function( body ) {
			return body.text();
		} );
		expect( blobScript ).toBe( supposedScript );
		*/
	} );
} );
