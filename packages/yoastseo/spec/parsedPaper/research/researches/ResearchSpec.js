import Research from "../../../../src/parsedPaper/research/researches/Research";
import { Heading, Node, Paragraph, StructuredNode } from "../../../../src/parsedPaper/structure/tree";

describe( "Research", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "isLeafNode", () => {
		it( "warns when it has not been implemented", () => {
			const research = new Research();

			const structuredNode = new StructuredNode( "div", {} );
			const heading = new Heading( 2, {} );
			const paragraph = new Paragraph( {} );

			expect( research.isLeafNode( structuredNode ) ).toEqual( false );
			expect( research.isLeafNode( heading ) ).toEqual( true );
			expect( research.isLeafNode( paragraph ) ).toEqual( true );
		} );
	} );

	describe( "calculateFor", () => {
		it( "warns when it has not been implemented", () => {
			const research = new Research();
			const node = new Node( "div" );

			research.calculateFor( node );

			expect( console.warn ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "mergeResults", () => {
		it( "warns when it has not been implemented", () => {
			const research = new Research();
			const node = new Node( "div" );

			research.mergeChildrenResults( node );

			expect( console.warn ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
