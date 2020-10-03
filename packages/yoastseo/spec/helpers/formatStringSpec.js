import formatString from "../../src/helpers/formatString";

describe( "formatString", () => {
	it( "formats a string with string parameters", () => {
		const string = "Hello %%name%%!";
		const map = {
			name: "World",
		};
		expect( formatString( string, map ) ).toEqual( "Hello World!" );
	} );

	it( "formats a string with multiple string parameters with the same name", () => {
		const string = "Hello %%name%%! The %%name%% is awesome, just like you!";
		const map = {
			name: "World",
		};
		expect( formatString( string, map ) ).toEqual( "Hello World! The World is awesome, just like you!" );
	} );

	it( "formats a string with multiple string parameters", () => {
		const string = "%%greeting%% %%name%%!";
		const map = {
			name: "World",
			greeting: "Hey",
		};
		expect( formatString( string, map ) ).toEqual( "Hey World!" );
	} );

	it( "formats a string with a number parameter", () => {
		const string = "%%greeting%% %%name%%!";
		const map = {
			name: "World",
			greeting: 5,
		};
		expect( formatString( string, map ) ).toEqual( "5 World!" );
	} );

	it( "escapes regular expressions in parameter names", () => {
		const string = "%%[a-z]%% %%.*?%%";
		const map = {
			"[a-z]": "World",
			".*?": 123,
		};
		expect( formatString( string, map ) ).toEqual( "World 123" );
	} );

	it( "ignores matches without format", () => {
		const string = "%%ignore%% %%this%%";
		const map = {
			ignore: "ignore the following:",
		};
		expect( formatString( string, map ) ).toEqual( "ignore the following: %%this%%" );
	} );

	it( "handles a normal string", () => {
		const string = "This is a normal string.";
		const map = {
			normal: "unused",
		};
		expect( formatString( string, map ) ).toEqual( "This is a normal string." );
	} );

	it( "handles a normal string with percent-signs in it", () => {
		const string = "Is this 1% of all the %-ages?";
		const map = {
			"%": "percent",
		};
		expect( formatString( string, map ) ).toEqual( "Is this 1% of all the %-ages?" );
	} );

	it( "handles multiple percent-signs in a row", () => {
		const string = "Can you handle %%%%% that?";
		const map = {
			"%": "percent",
		};
		expect( formatString( string, map ) ).toEqual( "Can you handle percent that?" );
	} );

	it( "handles other types of delimiters", () => {
		let string = "--Can you-- handle this--?--";
		let map = {
			"Can you": "I can",
			"?": "!",
		};
		expect( formatString( string, map, "--" ) ).toEqual( "I can handle this!" );

		string = "$$Can you$$ handle this$$?$$";
		map = {
			"Can you": "I can",
			"?": "!",
		};
		expect( formatString( string, map, "$$" ) ).toEqual( "I can handle this!" );
	} );
} );
