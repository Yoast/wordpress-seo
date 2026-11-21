import { ensureTree } from "../../src/parse/ensureTree";
import Paper from "../../src/values/Paper";
import Factory from "../../src/helpers/factory";
import memoizedSentenceTokenizer from "../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";

describe( "The ensureTree function", () => {
	const buildResearcher = () => Factory.buildMockResearcher( {}, true, false, false,
		{ memoizedTokenizer: memoizedSentenceTokenizer } );

	it( "is a no-op when the paper already has a tree", () => {
		const paper = new Paper( "<p>Hello, world!</p>" );
		const existingTree = { name: "#sentinel" };
		paper.setTree( existingTree );

		const result = ensureTree( paper, buildResearcher() );

		// The pre-existing tree must be left untouched, not rebuilt.
		expect( result ).toBe( paper );
		expect( result.getTree() ).toBe( existingTree );
	} );

	it( "builds the tree when it is null and returns the same paper instance", () => {
		const paper = new Paper( "<p>Hello, world!</p>" );
		expect( paper.getTree() ).toBeNull();

		const result = ensureTree( paper, buildResearcher() );

		expect( result ).toBe( paper );
		expect( result.getTree() ).not.toBeNull();
		expect( result.getTree().name ).toEqual( "#document-fragment" );
	} );
} );
