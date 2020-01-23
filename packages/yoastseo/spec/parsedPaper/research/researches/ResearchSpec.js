import Research from "../../../../src/parsedPaper/research/researches/Research";
import { Heading, Node, Paragraph, StructuredNode } from "../../../../src/parsedPaper/structure/tree";

describe( "Research", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "isLeafNode", () => {
		it( "returns `true` when it gets an instance of a `LeafNode` class, `false` if not.", () => {
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
		it( "flattens the results of its children", () => {
			const research = new Research();

			const results = [
				[
					{ hello: "world", number: 20 },
					{ hello: "universe", number: 13 },
				],
				[
					{ hello: "moon", number: 2023 },
					{ hello: "universe", number: 13 },
				],
				[
					{ hello: "you", number: 234 },
				],
			];

			const expected = [
				{ hello: "world", number: 20 },
				{ hello: "universe", number: 13 },
				{ hello: "moon", number: 2023 },
				{ hello: "universe", number: 13 },
				{ hello: "you", number: 234 },
			];

			const mergedResults = research.mergeChildrenResults( results );

			expect( mergedResults ).toEqual( expected );
		} );
	} );
} );
