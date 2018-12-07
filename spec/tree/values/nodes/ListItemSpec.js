import ListItem from "../../../../src/tree/values/nodes/ListItem";

describe( "ListItem", () => {
	it( "can make a ListItem node", () => {
		const startIndex = 0;
		const endIndex = 5;
		const children = [ "a", 1, true ];

		const listItemNode = new ListItem( startIndex, endIndex, children );
		expect( listItemNode.type ).toEqual( "listItem" );
		expect( listItemNode.startIndex ).toEqual( startIndex );
		expect( listItemNode.endIndex ).toEqual( endIndex );
		expect( listItemNode.children ).toEqual( children );
	} );
} );
