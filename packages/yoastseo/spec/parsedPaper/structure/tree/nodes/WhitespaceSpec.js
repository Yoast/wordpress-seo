import Whitespace from "../../../../../src/parsedPaper/structure/tree/nodes/Whitespace";

describe( "Whitespace", () => {
	describe( "constructor", () => {
		it( "creates a Whitespace node", () => {
			const whitespaceElement = new Whitespace();

			expect( whitespaceElement.type ).toEqual( "Whitespace" );
			expect( whitespaceElement.sourceStartIndex ).toEqual( 0 );
			expect( whitespaceElement.sourceEndIndex ).toEqual( 0 );
			expect( whitespaceElement.content ).toEqual( "" );
		} );
	} );
} );
