import ParsedPaper from "../../src/parsedPaper/ParsedPaper";
import TreeBuilder from "../../src/parsedPaper/build/tree/TreeBuilder";

describe( "ParsedPaper", () => {
	describe( "constructor", () => {
		it( "makes a new ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			expect( parsedPaper ).toBeInstanceOf( ParsedPaper );
		} );
	} );

	describe( "setTree", () => {
		it( "sets the _tree on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const HtmlTreeBuilder = new TreeBuilder();
			const tree = HtmlTreeBuilder.build( "<h1>test</h1>" );
			parsedPaper.setTree( tree );
			expect( parsedPaper._tree ).toEqual( tree );
		} );
	} );

	describe( "getTree", () => {
		it( "sets gets _tree from the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const HtmlTreeBuilder = new TreeBuilder();
			const tree = HtmlTreeBuilder.build( "<h1>test</h1>" );
			parsedPaper.setTree( tree );
			const result = parsedPaper.getTree();
			expect( result ).toEqual( tree );
		} );
	} );

	describe( "setMetaProperty", () => {
		it( "sets a key-value pair to the _metadata on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaProperty( "keyword", "test" );
			expect( parsedPaper._metaData ).toEqual( { keyword: "test" } );
		} );
	} );

	describe( "getMetaProperty", () => {
		it( "gets the value for a key from the _metadata on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaProperty( "keyword", "test" );
			const result = parsedPaper.getMetaProperty( "keyword" );
			expect( result ).toEqual( "test" );
		} );

		it( "returns undefined if the metaData key doesn't exist", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaProperty( "keyword", "test" );
			const result = parsedPaper.getMetaProperty( "badKey" );
			expect( result ).toBeUndefined();
		} );
	} );

	describe( "setMetaData", () => {
		it( "sets a full _metadata object on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( newMetaData );
			expect( parsedPaper._metaData ).toEqual( newMetaData );
		} );

		it( "overwrites the _metadata object on the ParsedPaper with a new object", () => {
			const parsedPaper = new ParsedPaper();
			const oldMetaData = {
				oldKeyword: "old",
				anotherOldKey: "oldTest",
			};
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( oldMetaData );
			parsedPaper.setMetaData( newMetaData );
			expect( parsedPaper._metaData ).toEqual( newMetaData );
		} );
	} );

	describe( "getMetaData", () => {
		it( "Returns the _metaData from the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( newMetaData );
			const result = parsedPaper.getMetaData();
			expect( result ).toEqual( newMetaData );
		} );
	} );
} );
