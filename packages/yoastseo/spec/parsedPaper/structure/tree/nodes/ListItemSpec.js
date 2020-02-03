import ListItem from "../../../../../src/parsedPaper/structure/tree/nodes/ListItem";

describe( "ListItem", () => {
	describe( "constructor", () => {
		it( "creates a ListItem node", () => {
			const sourceCodeLocation = {
				startTag: {
					startOffset: 0,
					endOffset: 4,
				},
				endTag: {
					startOffset: 12,
					endOffset: 17,
				},
				startOffset: 0,
				endOffset: 17,
			};
			const listItemNode = new ListItem( sourceCodeLocation );
			expect( listItemNode.type ).toEqual( "ListItem" );
			expect( listItemNode.sourceCodeLocation ).toEqual( sourceCodeLocation );
			expect( listItemNode.children ).toEqual( [] );
		} );
	} );
} );
