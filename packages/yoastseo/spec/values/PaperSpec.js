import Paper from "../../src/values/Paper.js";

describe( "Paper", function() {
	describe( "Creating an Paper", function() {
		it( "returns and empty keyword and text when no args are given", function() {
			const mockPaper = new Paper( "" );

			expect( mockPaper.getKeyword() ).toBe( "" );
			expect( mockPaper.getText() ).toBe( "" );
		} );

		it( "returns and a valid keyword and text when args are given", function() {
			const mockPaper = new Paper( "text with keyword", { keyword: "keyword" } );

			expect( mockPaper.getKeyword() ).toBe( "keyword" );
			expect( mockPaper.getText() ).toBe( "text with keyword" );
		} );
	} );

	describe( "Creating a Paper", function() {
		it( "returns description", function() {
			let paper = new Paper( "text, metaValues" );
			expect( paper.hasDescription() ).toBe( false );
			expect( paper.getDescription() ).toBe( "" );

			const attributes = {
				keyword: "keyword",
				description: "this is a meta",
			};
			paper = new Paper( "text", attributes );
			expect( paper.hasDescription() ).toBe( true );
			expect( paper.getDescription() ).toBe( "this is a meta" );
		} );

		it( "should return the slug", function() {
			const attributes = {
				slug: "post-slug",
			};

			const paper = new Paper( "text", attributes );
			expect( paper.hasSlug() ).toBe( true );
			expect( paper.getSlug() ).toBe( "post-slug" );
		} );

		it( "should return the slug, even though we use the deprecated url parameter", function() {
			const attributes = {
				url: "post-slug",
			};
			const consoleSpy = jest.spyOn( console, "warn" ).mockImplementation();

			const paper = new Paper( "text", attributes );
			expect( paper.hasSlug() ).toBe( true );
			expect( paper.getSlug() ).toBe( "post-slug" );
			expect( consoleSpy ).toHaveBeenCalled();
		} );

		it( "should return the slug, even though we pass an empty, deprecated url parameter", function() {
			const attributes = {
				slug: "post-slug",
				url: "",
			};
			const consoleSpy = jest.spyOn( console, "warn" ).mockImplementation();

			const paper = new Paper( "text", attributes );
			expect( paper.hasSlug() ).toBe( true );
			expect( paper.getSlug() ).toBe( "post-slug" );
			expect( consoleSpy ).toHaveBeenCalled();
		} );

		it( "returns synonyms", function() {
			const attributes = {
				keyword: "website",
				synonyms: "site",
			};

			const paper = new Paper( "text", attributes );
			expect( paper.hasSynonyms() ).toBe( true );
			expect( paper.getSynonyms() ).toBe( "site" );
		} );

		it( "returns title", function() {
			const attributes = {
				title: "title",
				titleWidth: 10,
			};
			const paper = new Paper( "text", attributes );
			expect( paper.hasTitle() ).toBe( true );
			expect( paper.getTitle() ).toBe( "title" );
			expect( paper.hasTitleWidth() ).toBe( true );
		} );

		it( "returns nothing", function() {
			const paper = new Paper( "text" );
			expect( paper.hasTitle() ).toBe( false );
			expect( paper.hasDescription() ).toBe( false );
			expect( paper.hasSlug() ).toBe( false );
			expect( paper.hasKeyword() ).toBe( false );
			expect( paper.hasTitleWidth() ).toBe( false );
		} );

		it( "returns locale", function() {
			let paper = new Paper( "" );
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
			const paper = new Paper( "" );

			expect( paper.hasPermalink() ).toBe( false );
		} );

		it( "has a permalink when passed one", function() {
			const paper = new Paper( "", { permalink: "permalink" } );

			expect( paper.hasPermalink() ).toBe( true );
		} );

		it( "has no permalink when passed an empty permalink", function() {
			const paper = new Paper( "", { permalink: "" } );

			expect( paper.hasPermalink() ).toBe( false );
		} );
	} );

	describe( "Create a paper with keyword with dollar sign", function() {
		it( "Should return keyword with dollar sign", function() {
			const paper = new Paper( "", { keyword: "$keyword" } );
			expect( paper.getKeyword() ).toBe( "$keyword" );
		} );
	} );

	describe( "Comparing papers", function() {
		const attributes1 = { slug: "test-test" };
		const attributes2 = { slug: "test-test-test" };

		it( "should identify two papers with similar content as equal", function() {
			const paper1 = new Paper( "This is a test" );
			const paper2 = new Paper( "This is a test" );
			expect( paper1.equals( paper2 ) ).toBe( true );
		} );

		it( "should identify two papers with dissimilar content as not equal", function() {
			const paper1 = new Paper( "This is a test" );
			const paper2 = new Paper( "This is a test, but with different content" );
			expect( paper1.equals( paper2 ) ).toBe( false );
		} );

		it( "should identify two papers with similar content and attributes as equal", function() {
			const paper1 = new Paper( "This is a test", attributes1 );
			const paper2 = new Paper( "This is a test", attributes1 );
			expect( paper1.equals( paper2 ) ).toBe( true );
		} );

		it( "should identify two papers with similar content but dissimilar attributes as not equal", function() {
			const paper1 = new Paper( "This is a test", attributes1 );
			const paper2 = new Paper( "This is a test", attributes2 );
			expect( paper1.equals( paper2 ) ).toBe( false );
		} );
	} );

	describe( "hasText", function() {
		it( "should return true if contains raw text", function() {
			const paper = new Paper( "This is a test" );
			expect( paper.hasText() ).toBeTruthy();
		} );
		it( "should return true if contains text with html tags", function() {
			const paper = new Paper( "<h1>This is a title</h1><p>This is a paragraph</p>" );
			expect( paper.hasText() ).toBeTruthy();
		} );
		it( "should return true if contains only html tag", function() {
			// eslint-disable-next-line max-len
			const paper = new Paper( "<img src=\"https://yoast.com/cdn-cgi/image/width=466%2Cheight=244%2Cfit=crop%2Cf=auto%2Conerror=redirect//app/uploads/2017/12/Focus_keyword_FI.jpg\">" );
			expect( paper.hasText() ).toBeTruthy();
		} );
		it( "should return true if contains a string of spaces", function() {
			const paper = new Paper( "        " );
			expect( paper.hasText() ).toBeTruthy();
		} );
		it( "should return false paper is empty string", function() {
			const paper = new Paper( "" );
			expect( paper.hasText() ).toBeFalsy();
		} );
	} );
	// describe( "hasContent", function() {
	// 	it( "should return true if contains raw text", function() {
	// 		const paper = new Paper( "This is a test" );
	// 		expect( paper.hasContent() ).toBeTruthy();
	// 	} );
	// 	it( "should return true if contains text with html tags", function() {
	// 		const paper = new Paper( "<h1>This is a title</h1><p>This is a paragraph</p>" );
	// 		expect( paper.hasContent() ).toBeTruthy();
	// 	} );
	// 	it( "should return false if contains only html tag", function() {
	// 		// eslint-disable-next-line max-len
	// 		const paper = new Paper( "<img src=\"https://yoast.com/cdn-cgi/image/width=466%2Cheight=244%2Cfit=crop%2Cf=auto%2Conerror=redirect//app/uploads/2017/12/Focus_keyword_FI.jpg\">" );
	// 		expect( paper.hasContent() ).toBeFalsy();
	// 	} );
	// 	it( "should return false if contains only a string of spaces", function() {
	// 		const paper = new Paper( "        " );
	// 		expect( paper.hasContent() ).toBeFalsy();
	// 	} );
	// 	it( "should return false paper is empty string", function() {
	// 		const paper = new Paper( "" );
	// 		expect( paper.hasContent() ).toBeFalsy();
	// 	} );
	// } );
} );
