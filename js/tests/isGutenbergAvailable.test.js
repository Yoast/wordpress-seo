import { isGutenbergDataAvailable, isGutenbergPostAvailable } from "../src/helpers/isGutenbergAvailable.js";

describe( 'isGutenbergDataAvailable', () => {
	it( 'returns true if both wp and wp.data are defined', () => {
		window.wp = { data: true };
		const actual = isGutenbergDataAvailable();
		expect( actual ).toBe( true );
	} );
	it( 'returns false if wp.data is not defined', () => {
		window.wp = { something: true };
		const actual = isGutenbergDataAvailable();
		expect( actual ).toBe( false );
	} );
	it( 'returns false if wp is not defined', () => {
		window.wp = undefined;
		const actual = isGutenbergDataAvailable();
		expect( actual ).toBe( false );
	} );
} );
