import List from "../../../../src/tree/values/nodes/List";
import ListItem from "../../../../src/tree/values/nodes/ListItem";

describe( "List", () => {
	it( "can make a List node", () => {
		const startIndex = 0;
		const endIndex = 30;
		const childrenForListItems = [ "a", 1, true ];
		const listItem1 = new ListItem( 4, 10, childrenForListItems );
		const listItem2 = new ListItem( 11, 17, childrenForListItems );
		const children = [ listItem1, listItem2 ];

		const listNode = new List( startIndex, endIndex, [ listItem1, listItem2 ] );

		expect( listNode.type ).toEqual( "list" );
		expect( listNode.startIndex ).toEqual( startIndex );
		expect( listNode.endIndex ).toEqual( endIndex );
		expect( listNode.children ).toEqual( children );
	} );
} );
