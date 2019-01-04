import ListItem from "../../../../src/tree/structure/nodes/ListItem";

describe( "ListItem", () => {
	describe( "constructor", () => {
		it( "creates a ListItem node", () => {
			const listItemNode = new ListItem();
			expect( listItemNode.type ).toEqual( "ListItem" );
			expect( listItemNode.startIndex ).toEqual( 0 );
			expect( listItemNode.endIndex ).toEqual( 0 );
			expect( listItemNode.children ).toEqual( [] );
		} );
	} );
} );
