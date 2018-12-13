import List from "../../../../src/tree/values/nodes/List";
import ListItem from "../../../../src/tree/values/nodes/ListItem";
import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "List", () => {
	describe( "constructor", () => {
		it( "can make a List node", () => {
			const list = new List( true );

			expect( list.type ).toEqual( "List" );
			expect( list.startIndex ).toEqual( 0 );
			expect( list.endIndex ).toEqual( 0 );
			expect( list.ordered ).toEqual( true );
			expect( list.children ).toEqual( [] );
		} );
	} );

	describe( "appendChild", () => {
		beforeEach( () => {
			console.warn = jest.fn();
		} );
		it( "warns about adding a child that is not a ListItem", () => {
			const list = new List( true );
			const listItem = new ListItem();
			const paragraph = new Paragraph( "p" );

			expect( list.type ).toEqual( "List" );
			expect( list.children ).toEqual( [] );

			list.appendChild( listItem );
			expect( console.warn ).not.toBeCalled();

			list.appendChild( paragraph );
			expect( console.warn ).toBeCalled();
		} );
	} );
} );
