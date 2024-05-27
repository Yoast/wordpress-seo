const browserslist = require( "browserslist" );
const config = require( "../" );

it( "should export an array", () => {
	expect( Array.isArray( config ) ).toBe( true );
} );

it( "should not contain invalid queries", () => {
	const result = browserslist( [ "extends @yoast/browserslist-config" ] );

	expect( result ).toBeTruthy();
} );
