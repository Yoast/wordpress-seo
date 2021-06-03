import StructuredNode from "../../../../../src/parsedPaper/structure/tree/nodes/StructuredNode";

describe( "StructuredNode", () => {
	describe( "constructor", () => {
		it( "creates a new StructuredNode", () => {
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

			const structuredTextNode = new StructuredNode( "div", sourceCodeLocation );
			expect( structuredTextNode.type ).toEqual( "StructuredNode" );
			expect( structuredTextNode.sourceCodeLocation ).toEqual( sourceCodeLocation );
			expect( structuredTextNode.children ).toEqual( [] );
			expect( structuredTextNode.tag ).toEqual( "div" );
		} );
	} );
} );
