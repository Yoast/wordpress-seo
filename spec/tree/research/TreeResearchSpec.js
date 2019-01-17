import { TreeResearcher } from "../../../src/tree/research";
import Research from "../../../src/tree/research/researches/Research";

describe( "TreeResearcher", () => {
	describe( "constructor", () => {
		it( "makes a new TreeResearcher", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher ).toBeInstanceOf( TreeResearcher );
		} );
	} );

	describe( "addResearch", () => {
		it( "adds a research", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher._researches ).toEqual( {
				"number of unicorns": research,
			} );
		} );
	} );

	describe( "getResearches", () => {

	} );

	describe( "hasResearch", () => {
		it( "returns true when the TreeResearcher has a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( true );
		} );

		it( "returns false when the TreeResearcher does not have a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( false );
		} );
	} );

	describe( "getResearchInstance", () => {
		it( "returns an instance of the given research when it exists", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.getResearch( "number of unicorns" ) ).toEqual( research );
		} );

		it( "throws an error if the given research does not exist", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( () => treeResearcher.getResearch( "number of dragons" ) ).toThrow();
		} );

		it( "throws an error if no name is given", () => {
			const treeResearcher = new TreeResearcher();
			expect( () => treeResearcher.getResearch() ).toThrow();
		} );
	} );

	describe( "getResearchForNode", () => {

	} );

	describe( "addResearchData", () => {

	} );

	describe( "getData", () => {

	} );
} );
