import Whitespace from "../../../../src/tree/values/nodes/Whitespace";

describe( "Whitespace", () => {
	it( "can make a Whitespace node", () => {
		const whitespaceElement = new Whitespace( 0, 8, "\t     \n" );

		expect( whitespaceElement.type ).toEqual( "whitespace" );
		expect( whitespaceElement.startIndex ).toEqual( 0 );
		expect( whitespaceElement.endIndex ).toEqual( 8 );
		expect( whitespaceElement.content ).toEqual( "\t     \n" );
	} );
} );
