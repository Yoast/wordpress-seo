import join from "../src/join";

describe( "join", () => {
	it( "joins the strings", () => {
		expect( join( [ "hello", "world" ] ) ).toBe( "hello-world" );
	} );

	it( "joins the strings using specified separator", () => {
		expect( join( [ "hello", "world" ], "<->" ) ).toBe( "hello<->world" );
	} );

	it( "joins the strings, ignoring falsy values", () => {
		expect( join( [ "hello", false, null, "", "world" ] ) ).toBe( "hello-world" );
	} );
} );
