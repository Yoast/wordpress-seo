import parseClassAttribute from "../../../../../src/parse/build/private/helpers/parseClassAttribute";

describe( "A test for parseClassAttribute", function() {
	it( "should return a set of n-1 classes if it contains a class that occurs twice", function() {
		const parsedClass = parseClassAttribute( "class-a class-b class-b" );

		expect( parsedClass ).toEqual( new Set( [ "class-a", "class-b" ] ) );
	} );

	it( "should return a set of n classes if all n classes are unique", function() {
		const parsedClass = parseClassAttribute( "class-a class-b" );

		expect( parsedClass ).toEqual( new Set( [ "class-a", "class-b" ] ) );
	} );
} );
