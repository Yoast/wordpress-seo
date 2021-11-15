import { createStoreState } from "./test-helpers";

describe( "Test helpers", () => {
	test( "should create a nested object", () => {
		const getStoreState = createStoreState( "a.b" );

		expect( getStoreState( "test" ) ).toEqual( { a: { b: "test" } } );
	} );
} );
