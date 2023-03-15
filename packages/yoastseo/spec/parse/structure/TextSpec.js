import Text from "../../../src/parse/structure/Text";

describe( "A test for the Text object", function() {
	it( "should correctly construct a Text object", function() {
		expect( new Text( "This is a text. It consists of 2 sentences" ) ).toEqual( {
			name: "#text", value: "This is a text. It consists of 2 sentences",
		} );
	} );
} );
