import Node from "../../../../src/tree/values/nodes/Node";

describe( "Node", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	it( "can make a new Node", () => {
		const node = new Node( "someNode" );

		expect( node.type ).toEqual( "someNode" );
		expect( node.startIndex ).toEqual( 0 );
		expect( node.endIndex ).toEqual( 0 );
	} );

	it( "throws a warning when calling the abstract map function", () => {
		const node = new Node( "node" );
		node.map( () => {} );
		expect( console.warn ).toBeCalled();
	} );

	it( "throws a warning when calling the abstract filter function", () => {
		const node = new Node( "node" );
		node.filter( () => {} );

		expect( console.warn ).toBeCalled();
	} );
} );

