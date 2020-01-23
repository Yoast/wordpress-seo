import TreeBuilder from "../../../src/parsedPaper/build/tree";
import { TreeResearcher } from "../../../src/parsedPaper/research";
import TestResearch from "../../specHelpers/tree/TestResearch";

describe( "TreeResearcher", () => {
	let treeBuilder;

	beforeEach( () => {
		treeBuilder = new TreeBuilder();
	} );

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
			const research = new TestResearch();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher._researches ).toEqual( {
				"number of unicorns": research,
			} );
		} );
	} );

	describe( "getResearches", () => {
		it( "returns the stored researches", () => {
			const treeResearcher = new TreeResearcher();
			treeResearcher.addResearch( "number of unicorns", new TestResearch() );
			treeResearcher.addResearch( "amount of rainbows", new TestResearch() );
			expect( treeResearcher.getResearches() ).toEqual( {
				"number of unicorns": new TestResearch(),
				"amount of rainbows": new TestResearch(),
			} );
		} );

		it( "returns an empty object when no researches are stored", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.getResearches() ).toEqual( { } );
		} );
	} );

	describe( "hasResearch", () => {
		it( "returns true when the TreeResearcher has a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			const research = new TestResearch();
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
			const research = new TestResearch();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.getResearch( "number of unicorns" ) ).toEqual( research );
		} );

		it( "throws an error if the given research does not exist", () => {
			const treeResearcher = new TreeResearcher();
			const research = new TestResearch();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( () => treeResearcher.getResearch( "number of dragons" ) ).toThrow();
		} );

		it( "throws an error if no name is given", () => {
			const treeResearcher = new TreeResearcher();
			expect( () => treeResearcher.getResearch() ).toThrow();
		} );
	} );

	describe( "doResearch", () => {
		it( "does a simple token count test research", done => {
			const treeResearcher = new TreeResearcher();
			/*
			  Test research splitting text on whitespace
			  and counting the nr. of resulting tokens.
			*/
			const research = new TestResearch();

			// A text with 12 tokens.
			const input = "<section>" +
				"<h1>This is a header</h1>" +
				"<p>This is a paragraph</p>" +
				"<section>This is a section</section>" +
				"</section>";
			const tree = treeBuilder.build( input );

			treeResearcher.addResearch( "test", research );

			const promisingResult = treeResearcher.doResearch( "test", tree );

			promisingResult.then( result => {
				expect( result ).toEqual( 12 );
				done();
			} );
		} );

		it( "uses the cached results when available", done => {
			const treeResearcher = new TreeResearcher();
			/*
			  Test research splitting text on whitespace
			  and counting the nr. of resulting tokens.
			*/
			const research = new TestResearch();

			// A text with 12 tokens.
			const input = "<section>" +
				"<h1>This is a header</h1>" +
				"<p>This is a paragraph</p>" +
				"<section>This is a section</section>" +
				"</section>";
			const tree = treeBuilder.build( input );

			treeResearcher.addResearch( "test", research );

			const promisingResult = treeResearcher.doResearch( "test", tree );

			promisingResult.then( result => {
				// Mock calculateFor function, to know that we are not computing the research a second time.
				research.calculateFor = jest.fn();
				// Run research again, this time we should be getting the cached results.
				const resultUsingCache = treeResearcher.doResearch( "test", tree );

				resultUsingCache.then( resultFromCache => {
					// Results should obviously stay the same.
					expect( resultFromCache ).toEqual( result );
					// Check if we do not do the research a second time.
					expect( research.calculateFor ).not.toHaveBeenCalled();
					done();
				} );
			} );
		} );

		it( "does not try to compute results when a node has no children", done => {
			const treeResearcher = new TreeResearcher();
			/*
			  Test research splitting text on whitespace
			  and counting the nr. of resulting tokens.
			*/
			const research = new TestResearch();

			// A text with 8 tokens.
			const input = "<section>" +
				"<h1>This is a header</h1>" +
				"<p>This is a paragraph</p>" +
				"<section></section>" +
				"</section>";
			const tree = treeBuilder.build( input );

			// 'section' element.
			tree.children[ 0 ].children[ 2 ].children = null;

			treeResearcher.addResearch( "test", research );

			const promisingResult = treeResearcher.doResearch( "test", tree );

			promisingResult.then( result => {
				expect( result ).toEqual( 8 );
				done();
			} );
		} );
	} );

	describe( "addResearchData", () => {
		it( "sets research data", () => {
			const treeResearcher = new TreeResearcher();
			const data = { array: [ 1, 2, 3, 4, 5 ] };
			treeResearcher.addResearchData( "number of gnomes", data );
			expect( treeResearcher._data ).toHaveProperty( "number of gnomes" );
			expect( treeResearcher._data[ "number of gnomes" ] ).toEqual( data );
		} );
	} );

	describe( "getData", () => {
		it( "gets research data", () => {
			const treeResearcher = new TreeResearcher();
			const data = { array: [ 1, 2, 3, 4, 5 ] };
			treeResearcher._data[ "number of gnomes" ] = data;
			expect( treeResearcher.getData( "number of gnomes" )  ).toEqual( data );
		} );
	} );
} );
