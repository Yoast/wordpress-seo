import urlKeyword from "../../src/researches/keywordCountInUrl.js";
import Paper from "../../src/values/Paper.js";

describe( "test to check url for keyword", function() {
	it( "returns matches", function() {
		expect( urlKeyword(
			new Paper( "", { url: "url-with-keyword", keyword: "keyword" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "key word" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "keyword" } )
		) ).toBe( 0 );

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "këyword" } )
		) ).toBe( 0 );

		expect( urlKeyword(
			new Paper( "", { url: "url-with-yoast-seo-3", keyword: "yoast seo 3" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "yoasts-analyzer", keyword: "Yoast's analyzer" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/acción/ ‎", keyword: "acción" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/accion/ ‎", keyword: "acción" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/natürlich/ ‎", keyword: "natürlich", locale: "de_DE" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/natuerlich/ ‎", keyword: "natürlich", locale: "de_DE" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/naturlich/ ‎", keyword: "natürlich", locale: "de_DE" } )
		) ).toBe( 0 );

		expect( urlKeyword(
			new Paper( "", { url: "http://local.wordpress.test/acción/ ‎", keyword: "acción", locale: "es_ES" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "bla-bla-oeverlaatelsebesiktning", keyword: "överlåtelsebesiktning", locale: "sv_SE" } )
		) ).toBe( 1 );

		expect( urlKeyword(
			new Paper( "", { url: "bla-bla-overlatelsebesiktning", keyword: "överlåtelsebesiktning", locale: "sv_SE" } )
		) ).toBe( 1 );
	} );
} );
