var matchStringWithTransliteration = require( "../../src/stringProcessing/matchTextWithTransliteration.js" );

describe( "matches a string to it's transliterated value", function() {
	var str = "this is a string with the keyword in it";
	var keyword = "keyword";
	it( "returns a match in a string", function() {
		expect( matchStringWithTransliteration( str, keyword )[ 0 ] ).toBe( "keyword" );
	} );

	it( "returns a match in a string with spaces", function() {
		keyword = "the keyword";
		expect( matchStringWithTransliteration( str, keyword )[ 0 ] ).toBe( "the keyword" );
	} );

	it( "matches transliteration", function() {
		keyword = "këyword";
		expect( matchStringWithTransliteration( str, keyword, "en_US" )[ 0 ] ).toBe( "keyword" );
	} );

	it( "matches transliteration and WP-style transliteration in German", function() {
		expect( matchStringWithTransliteration( "natürlich and natuerlich", "natürlich", "de_DE" ) ).toContain( "natürlich" );
		expect( matchStringWithTransliteration( "natürlich and natuerlich", "natürlich", "de_DE" ) ).toContain( "natuerlich" );
	} );

	it( "matches transliteration and WP-style transliteration in Spanish", function() {
		expect( matchStringWithTransliteration( "acción and accion", "acción", "es_ES" ) ).toContain( "acción" );
		expect( matchStringWithTransliteration( "acción and accion", "acción", "es_ES" ) ).toContain( "accion" );
	} );

	it( "matches transliteration and WP-style transliteration in Swedish", function() {
		expect( matchStringWithTransliteration( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ) ).toContain( "oeverlaatelsebesiktning" );
		expect( matchStringWithTransliteration( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ) ).toContain( "overlatelsebesiktning" );
	} );

	it( "matches transliteration and WP-style transliteration in Norwegian", function() {
		expect( matchStringWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "København" );
		expect( matchStringWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "Koebenhavn" );
		expect( matchStringWithTransliteration( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ) ).toContain( "Kobenhavn" );
	} );

	it( "matches transliteration and WP-style transliteration in Turkish", function() {
		expect( matchStringWithTransliteration( "Türkçe and Turkce", "Türkçe", "tr_TR" ) ).toContain( "Türkçe" );
		expect( matchStringWithTransliteration( "Türkçe and Turkce", "Türkçe", "tr_TR" ) ).toContain( "Turkce" );
	} );

	it( "matches strings with İ and ı in Turkish", function() {
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "İstanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "Istanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "istanbul", "tr_TR" ).length ).toBe( 4 );

		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "İstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "Istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "istanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ) ).toContain( "ıstanbul" );
		expect( matchStringWithTransliteration( "İstanbul  Istanbul  istanbul  ıstanbul", "ıstanbul", "tr_TR" ).length ).toBe( 4 );
	} );
} );
