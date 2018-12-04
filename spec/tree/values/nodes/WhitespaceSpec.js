import Whitespace from "../../../../src/tree/values/nodes/Whitespace";

describe( "Whitespace", () => {
	it( "can make a Whitespace node", () => {
		const whitespaceElement = new Whitespace();
		expect( whitespaceElement.content ).toEqual( " " );
	} );
} );
