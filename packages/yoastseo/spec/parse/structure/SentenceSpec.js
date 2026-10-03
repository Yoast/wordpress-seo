import Sentence from "../../../src/parse/structure/Sentence";

describe( "A test for the Sentence object", function() {
	it( "should correctly construct a Sentence object", function() {
		expect( new Sentence( "This is a sentence." ) ).toEqual( {
			text: "This is a sentence.", tokens: [], sourceCodeRange: {} } );
	} );
} );
