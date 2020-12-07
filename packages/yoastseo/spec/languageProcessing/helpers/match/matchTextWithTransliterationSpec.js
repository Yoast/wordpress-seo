import matchTextWithTransliteration from "../../../../src/languageProcessing/helpers/match/matchTextWithTransliteration.js";

describe( "matches a string to it's transliterated value", function() {
	var str = "this is a string with the keyword in it";
	var keyword = "keyword";
	it( "returns a match in a string", function() {
		expect( matchTextWithTransliteration( str, keyword )[ 0 ] ).toBe( "keyword" );
	} );

	it( "returns a match in a string with spaces", function() {
		keyword = "the keyword";
		expect( matchTextWithTransliteration( str, keyword )[ 0 ] ).toBe( "the keyword" );
	} );

	it( "matches transliteration", function() {
		keyword = "këyword";
		expect( matchTextWithTransliteration( str, keyword, "en_US" )[ 0 ] ).toBe( "keyword" );
	} );

	it( "matches transliteration and WP-style transliteration in German", function() {
		expect( matchTextWithTransliteration( "natürlich and natuerlich", "natürlich", "de_DE" ) ).toContain( "natürlich" );
		expect( matchTextWithTransliteration( "natürlich and natuerlich", "natürlich", "de_DE" ) ).toContain( "natuerlich" );
	} );

	it( "matches transliteration and WP-style transliteration in Spanish", function() {
		expect( matchTextWithTransliteration( "acción and accion", "acción", "es_ES" ) ).toContain( "acción" );
		expect( matchTextWithTransliteration( "acción and accion", "acción", "es_ES" ) ).toContain( "accion" );
	} );

	it( "matches transliteration and WP-style transliteration in Swedish", function() {
		expect( matchTextWithTransliteration( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ) ).toContain( "oeverlaatelsebesiktning" );
		expect( matchTextWithTransliteration( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ) ).toContain( "overlatelsebesiktning" );
	} );

	it( "matches transliteration and WP-style transliteration in Norwegian", function() {
		expect( matchTextWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "København" );
		expect( matchTextWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "Koebenhavn" );
		expect( matchTextWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "Kobenhavn" );
	} );

	it( "matches transliteration and WP-style transliteration in Turkish", function() {
		expect( matchTextWithTransliteration( "Türkçe and Turkce", "Türkçe", "tr_TR" ) ).toContain( "Türkçe" );
		expect( matchTextWithTransliteration( "Türkçe and Turkce", "Türkçe", "tr_TR" ) ).toContain( "Turkce" );
	} );

	it( "matches strings with İ and ı in Turkish", function() {
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchTextWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ).length ).toBe( 4 );
	} );
} );
