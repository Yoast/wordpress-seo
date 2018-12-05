import Whitespace from "../../../../src/tree/values/nodes/Whitespace";

describe( "Whitespace", () => {
	it( "can make a Whitespace node", () => {
		const whitespaceElement = new Whitespace( "\t     \n" );
		expect( whitespaceElement.content ).toEqual( "\t     \n" );
	} );
} );
