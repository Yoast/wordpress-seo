import includesAny from "../../src/helpers/includesAny";

describe( "includesAny", function() {
	test( "array: returns true if the value is included", function() {
		expect( includesAny( [ "a", "b", "c" ], [ "x", "b", "z" ] ) ).toBe( true );
	} );

	test( "array: returns false if the value is not included", function() {
		expect( includesAny( [ "a", "b", "c" ], [ "x", "y", "z" ] ) ).toBe( false );
	} );

	test( "object: returns true if the value is included", function() {
		expect( includesAny( { 0: "a", 1: "b", 2: "c" }, [ "x", "b", "z" ] ) ).toBe( true );
	} );

	test( "object: returns false if the value is not included", function() {
		expect( includesAny( { 0: "a", 1: "b", 2: "c" }, [ "x", "y", "z" ] ) ).toBe( false );
	} );

	test( "array: value type has to match too", function() {
		expect( includesAny( [ "0", "1", "2" ], [ 0, 1, 2 ] ) ).toBe( false );
	} );

	test( "array: empty values array has no matches", function() {
		expect( includesAny( [ "a", "b", "c" ], [] ) ).toBe( false );
	} );

	test( "object: does not match on object keys", function() {
		expect( includesAny( { 0: "a", 1: "b", 2: "c" }, [ 0, 1, 2 ] ) ).toBe( false );
	} );
} );
