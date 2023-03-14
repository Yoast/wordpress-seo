import Heading from "../../../src/parse/structure/Heading";

describe( "A test for the Heading object", () => {
	it( "should create a correct Heading block whe the constructor is called", function() {
		for ( let headingLevel = 1; headingLevel < 7; headingLevel++ ) {
			expect( new Heading( headingLevel ) ).toEqual( { name: `h${headingLevel}`, attributes: {}, childNodes: [], level: headingLevel } );
		}
	} );
} );
