import initialize from "../src/edit.js"

describe( 'initialize', () => {
	it( 'initializes all functionality on the edit screen', () => {

	const actual = initialize( );
	expect( actual.store ).toBeDefined();
	} );
} );
