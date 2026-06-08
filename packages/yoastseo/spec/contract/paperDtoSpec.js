import Paper from "../../src/values/Paper.js";
import { paperDtoSchema, toPaper } from "../../src/contract";

describe( "the Paper input contract (PaperDTO)", function() {
	describe( "toPaper", function() {
		it( "maps a valid keyphrase-core DTO onto a Paper", function() {
			const paper = toPaper( {
				text: "A post about cats.",
				keyphrase: "cat food",
				synonyms: "kitten food",
				locale: "en_US",
				description: "The best cat food.",
			} );

			expect( paper ).toBeInstanceOf( Paper );
			expect( paper.getText() ).toBe( "A post about cats." );
			// `keyphrase` maps to the engine's `keyword`.
			expect( paper.getKeyword() ).toBe( "cat food" );
			expect( paper.getSynonyms() ).toBe( "kitten food" );
			expect( paper.getLocale() ).toBe( "en_US" );
			expect( paper.getDescription() ).toBe( "The best cat food." );
		} );

		it( "maps the full neutral metadata surface onto Paper", function() {
			const paper = toPaper( {
				text: "x",
				title: "My SEO title",
				slug: "my-slug",
				permalink: "https://example.com/my-slug",
				titleWidth: 400,
				textTitle: "Article title",
				date: "2024-01-01",
				writingDirection: "RTL",
			} );

			expect( paper.getTitle() ).toBe( "My SEO title" );
			expect( paper.getSlug() ).toBe( "my-slug" );
			expect( paper.getPermalink() ).toBe( "https://example.com/my-slug" );
			expect( paper.getTitleWidth() ).toBe( 400 );
			expect( paper.getTextTitle() ).toBe( "Article title" );
			expect( paper.getDate() ).toBe( "2024-01-01" );
			expect( paper.getWritingDirection() ).toBe( "RTL" );
		} );

		it( "leaves absent optional fields to Paper's defaults, without throwing", function() {
			const paper = toPaper( { text: "Only text provided." } );

			expect( paper.getKeyword() ).toBe( "" );
			// Engine default, not set by the DTO.
			expect( paper.getLocale() ).toBe( "en_US" );
			expect( paper.getDescription() ).toBe( "" );
		} );

		it( "passes an open-ended customData object through unchanged", function() {
			const customData = { hasGlobalIdentifier: false, productType: "variable", anything: [ 1, 2 ] };
			const paper = toPaper( { text: "x", customData } );

			expect( paper.getCustomData() ).toEqual( customData );
		} );

		it( "rejects a non-object customData (shape is validated)", function() {
			expect( () => toPaper( { text: "x", customData: "not an object" } ) ).toThrow();
		} );

		it( "rejects siteUrl/domain for now (deferred to the competing-links refactor)", function() {
			expect( () => toPaper( { text: "x", siteUrl: "https://example.com" } ) ).toThrow();
			expect( () => toPaper( { text: "x", domain: "example.com" } ) ).toThrow();
		} );

		it( "throws on a structurally invalid payload (wrong type)", function() {
			expect( () => toPaper( { text: 123 } ) ).toThrow();
		} );

		it( "throws on unknown or typo'd keys (strict)", function() {
			expect( () => toPaper( { text: "x", keyphrse: "typo" } ) ).toThrow();
		} );

		it( "accepts the deprecated `keyword` alias and maps it to the keyphrase", function() {
			const paper = toPaper( { text: "x", keyword: "cat food" } );
			expect( paper.getKeyword() ).toBe( "cat food" );
		} );

		it( "prefers `keyphrase` over the deprecated `keyword` when both are supplied", function() {
			const paper = toPaper( { text: "x", keyphrase: "preferred", keyword: "legacy" } );
			expect( paper.getKeyword() ).toBe( "preferred" );
		} );
	} );

	describe( "paperDtoSchema", function() {
		it( "accepts a minimal valid payload", function() {
			expect( paperDtoSchema.parse( { text: "hi" } ) ).toEqual( { text: "hi" } );
		} );
	} );
} );
