import Paper from "../../src/values/Paper.js";

describe( "Paper", function() {
	describe( "Creating an Paper", function() {
		it( "returns and empty keyword and text when no args are given", function() {
			var mockPaper = new Paper();

			expect( mockPaper.getKeyword() ).toBe( "" );
			expect( mockPaper.getText() ).toBe( "" );
		} );

		it( "returns and a valid keyword and text when args are given", function() {
			var mockPaper = new Paper( "text with keyword", { keyword: "keyword" } );

			expect( mockPaper.getKeyword() ).toBe( "keyword" );
			expect( mockPaper.getText() ).toBe( "text with keyword" );
		} );
	} );

	describe( "Creating a Paper", function() {
		it( "returns description", function() {
			var attributes = {};
			var paper = new Paper( "text, metaValues" );
			expect( paper.hasDescription() ).toBe( false );
			expect( paper.getDescription() ).toBe( "" );

			attributes = {
				keyword: "keyword",
				description: "this is a meta",
			};
			paper = new Paper( "text", attributes );
			expect( paper.hasDescription() ).toBe( true );
			expect( paper.getDescription() ).toBe( "this is a meta" );
		} );

		it( "returns url", function() {
			var attributes = {
				url: "http://yoast.com/post",
			};

			var paper = new Paper( "text", attributes );
			expect( paper.hasUrl() ).toBe( true );
			expect( paper.getUrl() ).toBe( "http://yoast.com/post" );
			expect( paper.hasSynonyms() ).toBe( false );
			expect( paper.getSynonyms() ).toBe( "" );
		} );

		it( "returns synonyms", function() {
			var attributes = {
				keyword: "website",
				synonyms: "site",
			};

			var paper = new Paper( "text", attributes );
			expect( paper.hasSynonyms() ).toBe( true );
			expect( paper.getSynonyms() ).toBe( "site" );
		} );

		it( "returns title", function() {
			var attributes = {
				title: "title",
				titleWidth: 10,
			};
			var paper = new Paper( "text", attributes );
			expect( paper.hasTitle() ).toBe( true );
			expect( paper.getTitle() ).toBe( "title" );
			expect( paper.hasTitleWidth() ).toBe( true );
		} );

		it( "returns nothing", function() {
			var paper = new Paper( "text" );
			expect( paper.hasTitle() ).toBe( false );
			expect( paper.hasDescription() ).toBe( false );
			expect( paper.hasUrl() ).toBe( false );
			expect( paper.hasKeyword() ).toBe( false );
			expect( paper.hasTitleWidth() ).toBe( false );
		} );

		it( "returns locale", function() {
			var paper = new Paper( "" );
			expect( paper.getLocale() ).toBe( "en_US" );
			paper = new Paper( "", { locale: "de_DE" } );
			expect( paper.getLocale() ).toBe( "de_DE" );
			paper = new Paper( "", { locale: "" } );
			expect( paper.getLocale() ).toBe( "en_US" );
			expect( paper.hasLocale() ).toBe( true );
		} );
	} );

	describe( "hasPermalink", function() {
		it( "has no permalink on construction", function() {
			var paper = new Paper();

			expect( paper.hasPermalink() ).toBe( false );
		} );

		it( "has a permalink when passed one", function() {
			var paper = new Paper( "", { permalink: "permalink" } );

			expect( paper.hasPermalink() ).toBe( true );
		} );

		it( "has no permalink when passed an empty permalink", function() {
			var paper = new Paper( "", { permalink: "" } );

			expect( paper.hasPermalink() ).toBe( false );
		} );
	} );

	describe( "Create a paper with keyword with dollar sign", function() {
		it( "Should return keyword with dollar sign", function() {
			var paper = new Paper( "", { keyword: "$keyword" } );
			expect( paper.getKeyword() ).toBe( "$keyword" );
		} );
	} );
} );
