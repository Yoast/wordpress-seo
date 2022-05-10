// Dependencies
import { createExceptionHandler, isSameOrigin, createBlobURL } from "../../src/worker/createWorker";

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
	it( "does something", () => {
		global.URL.createObjectURL = jest.fn();
		createBlobURL( "dogs" );
		expect( global.URL.createObjectURL ).toBeCalledTimes( 1 );
		const blob = new Blob( [ "test" ] );
		expect( global.URL.createObjectURL ).toBeCalledWith( blob );
		expect( blob ).toBeInstanceOf( Blob );
		const blobAsText = blob.text;
		console.log( blobAsText );
		const blobType = blob.slice();
		console.log( blobType );
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
	/*
	It( "does something else", () => {
		const doc = new jsPDF();
		const fileName = "test.pdf";
		doc.text( "Hello world!" );
		const blob = new Blob( [ doc.output() ] );
		download( fileName, blob );
	} );
	it( "createExceptionHandler fails with an error", async() => {
	expect.assertions( 1 );
	try {
		await createExceptionHandler();
	} catch ( error ) {
		expect( error ).toMatch( "Error occurred during worker initialization:" );
	}
} );
	 */
} );
