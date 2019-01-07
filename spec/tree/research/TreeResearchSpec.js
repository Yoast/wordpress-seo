import { TreeResearcher } from "../../../src/tree/research";
import Research from "../../../src/tree/research/researches/Research";
import Node from "../../../src/tree/values/nodes/Node";


describe( "TreeResearcher", () => {
	describe( "constructor", () => {
		it( "makes a new TreeResearcher", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher ).toBeInstanceOf( TreeResearcher );
		} );
	} );

	describe( "setTree", () => {
		it( "sets a new tree", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.tree ).toEqual( null );
			const node = new Node( "div", 0, 10 );
			treeResearcher.setTree( node );
			expect( treeResearcher.tree ).toBeInstanceOf( Node );
		} );
	} );

	describe( "addResearch", () => {
		it( "adds a research", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.researches ).toEqual( {
				"number of unicorns": research,
			} );
		} );
	} );

	describe( "hasResearch", () => {
		it( "returns true when the TreeResearcher has a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( true );
		} );

		it( "returns false when the TreeResearcher does not have a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.researches ).toEqual( {} );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( false );
		} );
	} );

	describe( "getResearchInstance", () => {
		it( "returns an instance of the given research when it exists", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.getResearchInstance( "number of unicorns" ) ).toEqual( research );
		} );

		it( "returns false if the given research does not exist", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.getResearchInstance( "number of dragons" ) ).toEqual( false );
		} );

		it( "throws an error if no name is given", () => {
			const treeResearcher = new TreeResearcher();

			const getResearchInstanceEmptyName = () => treeResearcher.getResearchInstance();

			expect( getResearchInstanceEmptyName ).toThrow();
		} );
	} );

	describe( "getResearchForNode", () => {

	} );
} );
