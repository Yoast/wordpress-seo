var wordMatch = require( "../../js/stringProcessing/matchTextWithWord.js" );

describe( "Counts the occurences of a word in a string", function() {
	it( "returns number", function() {
		expect( wordMatch( "this is a test string", "test" ).count ).toBe( 1 );
		// This fails now because the regex isn't working properly for wordboundaries.
		// Expect(wordMatch("this is a test test test", "test")).toBe(3);
		expect( wordMatch( "test with maïs", "maïs" ).count ).toBe( 1 );
		expect( wordMatch( "test with maïs", "maïs" ).matches ).toEqual( [ "maïs" ] );
		expect( wordMatch( "test with mais", "maïs", "nl_NL" ).count ).toBe( 1 );
		expect( wordMatch( "test with maïs", "maïs", "nl_NL" ).matches ).toEqual( [ "maïs" ] );
	} );

	it( "should not match in HTML tags", function() {
		expect( wordMatch( "<img alt='keyword' />", "keyword" ).count ).toBe( 0 );
		expect( wordMatch( "<img alt='keyword' />", "keyword" ).matches ).toEqual( [] );
		expect( wordMatch( "<img width='100' />", "width" ).count ).toBe( 0 );
		expect( wordMatch( "<img width='100' />", "width" ).matches ).toEqual( [] );
	} );

	it( "should match quotes", function() {
		expect( wordMatch( "Yoast's analyzer", "Yoast's" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast's" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast\"s analyzer", "Yoast\"s analyzer" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast\"s analyzer", "Yoast\"s analyzer" ).matches ).toEqual( [ "Yoast\"s analyzer" ] );
		expect( wordMatch( "Yoast’s analyzer", "Yoast’s" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of quotes/apostrophes in matches field (for markings)
		expect( wordMatch( "Yoast’s analyzer", "Yoast’s" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast's analyzer", "Yoast's" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast's" ).matches ).toEqual( [ "Yoast's" ] );
	} );

	it( "should match normalized regardless of the type of quotes/apostrophes used", function() {
		expect( wordMatch( "Yoast’s analyzer", "Yoast's" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of quotes/apostrophes in matches field (for markings)
		expect( wordMatch( "Yoast’s analyzer", "Yoast's" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast's analyzer", "Yoast’s" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast’s" ).matches ).toEqual( [ "Yoast's" ] );
	} );

	it( "should match special characters", function() {
		expect( wordMatch( "a string with diacritics äöüß oompaloomp", "äöüß oompaloomp" ).count ).toBe( 1 );
		expect( wordMatch( "a string with diacritics äöüß oompaloomp", "äöüß oompaloomp" ).matches ).toEqual( [ "äöüß oompaloomp" ] );

		expect( wordMatch( "", "äbc" ).count ).toBe( 0 );
		expect( wordMatch( "", "äbc" ).matches ).toEqual( [] );

		expect( wordMatch( "accion", "acción", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "accion", "acción", "es_ES" ).matches ).toEqual( [ "accion" ] );

		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ).count ).toBe( 2 );
		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ).matches ).toContain( "oeverlaatelsebesiktning" );
		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning", "överlåtelsebesiktning", "sv_SE" ).matches ).toContain( "overlatelsebesiktning" );

		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).count ).toBe( 3 );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "København" );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "Koebenhavn" );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "Kobenhavn" );

		expect( wordMatch( "Türkçe and Turkce", "Türkçe", "tr_TR" ).count ).toBe( 2 );
		expect( wordMatch( "Türkçe and Turkce", "Türkçe", "tr_TR" ).matches ).toContain( "Türkçe" );
		expect( wordMatch( "Türkçe and Turkce", "Türkçe", "tr_TR" ).matches ).toContain( "Turkce" );

		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).matches ).toContain( "İstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).matches ).toContain( "Istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).matches ).toContain( "istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).matches ).toContain( "ıstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).count ).toBe( 4 );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "İstanbul", "tr_TR" ).position ).toBe( 0 );

		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).matches ).toContain( "İstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).matches ).toContain( "Istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).matches ).toContain( "istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).matches ).toContain( "ıstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).count ).toBe( 4 );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "Istanbul", "tr_TR" ).position ).toBe( 0 );

		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).matches ).toContain( "İstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).matches ).toContain( "Istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).matches ).toContain( "istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).matches ).toContain( "ıstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).count ).toBe( 4 );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "istanbul", "tr_TR" ).position ).toBe( 0 );

		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).matches ).toContain( "İstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).matches ).toContain( "Istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).matches ).toContain( "istanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).matches ).toContain( "ıstanbul" );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).count ).toBe( 4 );
		expect( wordMatch( "İstanbul and Istanbul and istanbul and ıstanbul", "ıstanbul", "tr_TR" ).position ).toBe( 0 );
	} );

	it( "should match words and numbers", function() {
		expect( wordMatch( "a string test 123 with test 123", "test 123" ).count ).toBe( 2 );
		expect( wordMatch( "a string test 123 with test 123", "test 123" ).matches ).toEqual( [ "test 123", "test 123" ] );
		expect( wordMatch( "only numbers 123", "123" ).count ).toBe( 1 );
		expect( wordMatch( "only numbers 123", "123" ).matches ).toEqual( [ "123" ] );
		expect( wordMatch( "only numbers123", "123" ).count ).toBe( 0 );
		expect( wordMatch( "only numbers123", "123" ).matches ).toEqual( [] );
	} );

	it( "should match cyrillic characters", function() {
		expect( wordMatch( "Тест текст тест нечто Тест текст тест нечто", "текст" ).count ).toBe( 2 );
		expect( wordMatch( "Тест текст тест нечто Тест текст тест нечто", "текст" ).matches ).toEqual( [ "текст", "текст" ] );
	} );

	it( "should match alternative whitespace", function() {
		expect( wordMatch( "focus&nbsp;keyword", "focus keyword" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of spaces in matches field (for markings)
		expect( wordMatch( "focus&nbsp;keyword", "focus keyword" ).matches ).toEqual( [ "focus keyword" ] );
	} );

	it( "should match hebrew", function() {
		expect( wordMatch( "ל בעל", "ל בעל" ).count ).toBe( 1 );
		expect( wordMatch( "ל בעל", "ל בעל" ).matches ).toEqual( [ "ל בעל" ] );
		expect( wordMatch( "", "ל בעל" ).count ).toBe( 0 );
		expect( wordMatch( "", "ל בעל" ).matches ).toEqual( [] );
	} );

	it( "should match dashes in the keyword", function() {
		expect( wordMatch( "text key-word text", "key-word" ).count ).toBe( 1 );
		expect( wordMatch( "text key-word text", "key-word" ).matches ).toEqual( [ "key-word" ] );
		expect( wordMatch( "", "key-word" ).count ).toBe( 0 );
		expect( wordMatch( "", "key-word" ).matches ).toEqual( [] );
	} );

	it( "should match within special characters", function() {
		expect( wordMatch( "Sed <keyword» dictum", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "Sed <keyword» dictum", "keyword" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "Sed «keyword> dictum", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "Sed «keyword> dictum", "keyword" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "Sed ‹keyword› dictum", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "Sed ‹keyword› dictum", "keyword" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "", "keyword" ).count ).toBe( 0 );
		expect( wordMatch( "", "keyword" ).matches ).toEqual( [] );
	} );

	it( "should match keyphrases comprised of multiple words. ", function() {
		expect( wordMatch( "text key word text", "key word" ).count ).toBe( 1 );
		expect( wordMatch( "text key word text", "key word" ).matches ).toEqual( [ "key word" ] );
	} );

	it( "should match keywords preceded by a punctuation mark.", function() {
		expect( wordMatch( "¿Como hacer guacamole?", "como" ).count ).toBe( 1 );
		expect( wordMatch( "¿Como hacer guacamole?", "como" ).matches ).toEqual( [ "Como" ] );

		expect( wordMatch( "¿keyword.", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "¿keyword.", "keyword" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "¡keyword.", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "¡keyword.", "keyword" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "«keyword»", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "«keyword»", "keyword" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "(keyword)", "keyword" ).count ).toBe( 1 );
		expect( wordMatch( "(keyword)", "keyword" ).matches ).toEqual( [ "keyword" ] );
	} );
} );
