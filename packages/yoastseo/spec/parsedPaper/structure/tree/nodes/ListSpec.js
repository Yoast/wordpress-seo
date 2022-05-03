import List from "../../../../../src/parsedPaper/structure/tree/nodes/List";
import ListItem from "../../../../../src/parsedPaper/structure/tree/nodes/ListItem";
import Paragraph from "../../../../../src/parsedPaper/structure/tree/nodes/Paragraph";

describe( "List", () => {
	describe( "constructor", () => {
		it( "creates a List node", () => {
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

			const list = new List( true, sourceCodeLocation );

			expect( list.tag ).toEqual( "List" );
			expect( list.sourceCodeLocation ).toEqual( sourceCodeLocation );
			expect( list.ordered ).toEqual( true );
			expect( list.children ).toEqual( [] );
		} );
	} );

	describe( "addChild", () => {
		beforeEach( () => {
			console.warn = jest.fn();
		} );
		it( "warns about adding a child that is not a ListItem", () => {
			const list = new List( true, {} );
			const listItem = new ListItem( {} );
			const paragraph = new Paragraph( "p" );

			expect( list.children ).toEqual( [] );

			list.addChild( listItem );
			expect( console.warn ).not.toBeCalled();

			list.addChild( paragraph );
			expect( console.warn ).toBeCalled();
		} );
	} );
} );
