import Token from "../../../src/parse/structure/Token";

describe( "A test for the Token object", function() {
	it( "should correctly construct a Token object", function() {
		expect( new Token( "This" ) ).toEqual( { text: "This", sourceCodeRange: {} } );
	} );
} );
