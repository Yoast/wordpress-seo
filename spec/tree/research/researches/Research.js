import Research from "../../../../src/tree/research/researches/Research";
import { Node } from "../../../../src/tree/structure";

describe( "Research", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "isLeafNode", () => {
		it( "warns when it has not been implemented", () => {
			const research = new Research();
			const node = new Node( "div" );

			research.isLeafNode( node );

			expect( console.warn ).toHaveBeenCalledTimes( 1 );
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
