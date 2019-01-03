import Whitespace from "../../../../src/tree/values/nodes/Whitespace";

describe( "Whitespace", () => {
	describe( "constructor", () => {
		it( "creates a Whitespace node", () => {
			const whitespaceElement = new Whitespace();

			expect( whitespaceElement.type ).toEqual( "Whitespace" );
			expect( whitespaceElement.startIndex ).toEqual( 0 );
			expect( whitespaceElement.endIndex ).toEqual( 0 );
			expect( whitespaceElement.content ).toEqual( "" );
		} );
	} );
} );
