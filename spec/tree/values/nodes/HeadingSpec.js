import Heading from "../../../../src/tree/values/nodes/Heading";
import TextContainer from "../../../../src/tree/values/nodes/TextContainer";

describe( "Heading", () => {
	describe( "constructor", () => {
		it( "can make a heading", () => {
			const text = new TextContainer( "This is the main title", [] );
			const heading = new Heading( 0, 8, 1, text );

			expect( heading.startIndex ).toEqual( 0 );
			expect( heading.endIndex ).toEqual( 8 );
			expect( heading.level ).toEqual( 1 );
			expect( heading.textContainer ).toEqual( text );
		} );
	} );
} );
