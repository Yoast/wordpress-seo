import formatString from "../../src/helpers/formatString";

describe( "formatString", () => {
	it( "formats a string with string parameters", () => {
		const string = "Hello %name%!";
		const map = {
			name: "World",
		};
		expect( formatString( string, map ) ).toEqual( "Hello World!" );
	} );

	it( "formats a string with multiple string parameters with the same name", () => {
		const string = "Hello %name%! The %name% is awesome, just like you!";
		const map = {
			name: "World",
		};
		expect( formatString( string, map ) ).toEqual( "Hello World! The World is awesome, just like you!" );
	} );

	it( "formats a string with multiple string parameters", () => {
		const string = "%greeting% %name%!";
		const map = {
			name: "World",
			greeting: "Hey",
		};
		expect( formatString( string, map ) ).toEqual( "Hey World!" );
	} );

	it( "formats a string with a number parameter", () => {
		const string = "%greeting% %name%!";
		const map = {
			name: "World",
			greeting: 5,
		};
		expect( formatString( string, map ) ).toEqual( "5 World!" );
	} );

	it( "escapes regular expressions in parameter names", () => {
		const string = "%[a-z]% %.*?%";
		const map = {
			"[a-z]": "World",
			".*?": 123,
		};
		expect( formatString( string, map ) ).toEqual( "World 123" );
	} );
} );
