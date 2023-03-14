import Token from "../../../src/parse/structure/Token";

describe( "A test for the Sentence object", function() {
	it( "should correctly construct a Sentence object", function() {
		expect( new Token( "This" ) ).toEqual( { text: "This" } );
	} );
} );
