var types = require( "../../src/helpers/types" );

var getType = types.getType;

describe( "checks type", function() {
	it( "returns the type - number", function() {
		var number = 7;
		expect( getType( number ) ).toBe( "number" );
	} );
	it( "returns the type - string", function() {
		var text = "text";
		expect( getType( text ) ).toBe( "string" );
	} );
	it( "returns the type - boolean", function() {
		var bool = true;
		expect( getType( bool ) ).toBe( "boolean" );
	} );

	it( "returns the type - object", function() {
		var obj = {};
		expect( getType( obj ) ).toBe( "object" );
	} );
	it( "returns the type - array", function() {
		var arr = [];
		expect( getType( arr ) ).toBe( "array" );
	} );
	it( "returns the default type - function", function() {
		var func = function() {};
		expect( getType( func ) ).toBe( "function" );
	} );
} );

var isSameType = types.isSameType;

describe( "compares types", function() {
	it( "returns true because the types are the same", function() {
		var number = 1337;
		expect( isSameType( number, "number" ) ).toBe( true );
	} );
	it( "returns true because the types are the same", function() {
		var number = 1337;
		expect( isSameType( number, "array" ) ).toBe( false );
	} );
} );
