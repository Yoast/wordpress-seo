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

		it( "leaves absent optional fields to Paper's defaults, without throwing", function() {
			const paper = toPaper( { text: "Only text provided." } );

			expect( paper.getKeyword() ).toBe( "" );
			// Engine default, not set by the DTO.
			expect( paper.getLocale() ).toBe( "en_US" );
			expect( paper.getDescription() ).toBe( "" );
		} );

		it( "stashes siteUrl and domain in customData as a placeholder", function() {
			const paper = toPaper( {
				text: "x",
				siteUrl: "https://example.com",
				domain: "example.com",
			} );

			expect( paper.getCustomData() ).toEqual( {
				siteUrl: "https://example.com",
				domain: "example.com",
			} );
		} );

		it( "throws on a structurally invalid payload (wrong type)", function() {
			expect( () => toPaper( { text: 123 } ) ).toThrow();
		} );

		it( "throws on unknown or typo'd keys (strict)", function() {
			expect( () => toPaper( { text: "x", keyword: "typo" } ) ).toThrow();
		} );
	} );

	describe( "paperDtoSchema", function() {
		it( "accepts a minimal valid payload", function() {
			expect( paperDtoSchema.parse( { text: "hi" } ) ).toEqual( { text: "hi" } );
		} );
	} );
} );
