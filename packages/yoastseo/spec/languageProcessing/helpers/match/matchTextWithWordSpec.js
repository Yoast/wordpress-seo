import wordMatch from "../../../../src/languageProcessing/helpers/match/matchTextWithWord.js";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

describe( "Counts the occurences of a word in a string", function() {
	it( "returns number", function() {
		expect( wordMatch( "this is a test string", "test", "nl_NL" ).count ).toBe( 1 );
		// This fails now because the regex isn't working properly for wordboundaries.
		// Expect(wordMatch("this is a test test test", "test")).toBe(3);
		expect( wordMatch( "test with maïs", "maïs", "nl_NL" ).count ).toBe( 1 );
		expect( wordMatch( "test with maïs", "maïs", "nl_NL" ).matches ).toEqual( [ "maïs" ] );
		expect( wordMatch( "test with mais", "maïs", "nl_NL" ).count ).toBe( 1 );
		expect( wordMatch( "test with maïs", "maïs", "nl_NL" ).matches ).toEqual( [ "maïs" ] );
	} );

	it( "should not match in HTML tags", function() {
		expect( wordMatch( "<img alt='keyword' />", "keyword", "en_US" ).count ).toBe( 0 );
		expect( wordMatch( "<img alt='keyword' />", "keyword", "en_US" ).matches ).toEqual( [] );
		expect( wordMatch( "<img width='100' />", "width", "en_US" ).position ).toEqual( -1 );
		expect( wordMatch( "<img width='100' />", "width", "en_US" ).count ).toBe( 0 );
		expect( wordMatch( "<img width='100' />", "width", "en_US" ).matches ).toEqual( [] );
		expect( wordMatch( "<img width='100' />", "width", "en_US" ).position ).toEqual( -1 );
	} );

	it( "should match quotes", function() {
		expect( wordMatch( "Yoast's analyzer", "Yoast's", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast's", "en_US" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast\"s analyzer", "Yoast\"s analyzer", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast\"s analyzer", "Yoast\"s analyzer", "en_US" ).matches ).toEqual( [ "Yoast\"s analyzer" ] );
		expect( wordMatch( "Yoast’s analyzer", "Yoast’s", "en_US" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of quotes/apostrophes in matches field (for markings)
		expect( wordMatch( "Yoast’s analyzer", "Yoast’s", "en_US" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast's analyzer", "Yoast's", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast's", "en_US" ).matches ).toEqual( [ "Yoast's" ] );
	} );

	it( "should match normalized regardless of the type of quotes/apostrophes used", function() {
		expect( wordMatch( "Yoast’s analyzer", "Yoast's", "en_US" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of quotes/apostrophes in matches field (for markings)
		expect( wordMatch( "Yoast’s analyzer", "Yoast's", "en_US" ).matches ).toEqual( [ "Yoast's" ] );
		expect( wordMatch( "Yoast's analyzer", "Yoast’s", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Yoast's analyzer", "Yoast’s", "en_US" ).matches ).toEqual( [ "Yoast's" ] );
	} );

	// eslint-disable-next-line max-statements
	it( "should match special characters", function() {
		expect( wordMatch( "a string with diacritics äöüß oompaloomp", "äöüß oompaloomp", "de_DE" ).count ).toBe( 1 );
		expect( wordMatch( "a string with diacritics äöüß oompaloomp", "äöüß oompaloomp", "de_DE" ).matches ).toEqual( [ "äöüß oompaloomp" ] );

		expect( wordMatch( "", "äbc", "de_DE" ).count ).toBe( 0 );
		expect( wordMatch( "", "äbc", "de_DE" ).matches ).toEqual( [] );

		expect( wordMatch( "accion", "acción", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "accion", "acción", "es_ES" ).matches ).toEqual( [ "accion" ] );

		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning",
			"överlåtelsebesiktning", "sv_SE" ).count ).toBe( 2 );
		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning",
			"överlåtelsebesiktning", "sv_SE" ).matches ).toContain( "oeverlaatelsebesiktning" );
		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning",
			"överlåtelsebesiktning", "sv_SE" ).matches ).toContain( "overlatelsebesiktning" );
		expect( wordMatch( "oeverlaatelsebesiktning and overlatelsebesiktning",
			"överlåtelsebesiktning", "sv_SE" ).position ).toBe( 0 );

		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).count ).toBe( 3 );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "København" );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "Koebenhavn" );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).matches ).toContain( "Kobenhavn" );
		expect( wordMatch( "København and Koebenhavn and Kobenhavn", "København", "nb_NO" ).position ).toBe( 0 );

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
		expect( wordMatch( "a string test 123 with test 123", "test 123", "en_US" ).count ).toBe( 2 );
		expect( wordMatch( "a string test 123 with test 123", "test 123", "en_US" ).matches ).toEqual( [ "test 123", "test 123" ] );
		expect( wordMatch( "only numbers 123", "123", "us_US" ).count ).toBe( 1 );
		expect( wordMatch( "only numbers 123", "123", "us_US" ).matches ).toEqual( [ "123" ] );
		expect( wordMatch( "only numbers123", "123", "us_US" ).count ).toBe( 0 );
		expect( wordMatch( "only numbers123", "123", "us_US" ).matches ).toEqual( [] );
	} );

	it( "should match cyrillic characters", function() {
		expect( wordMatch( "Тест текст тест нечто Тест текст тест нечто", "текст", "ru_RU" ).count ).toBe( 2 );
		expect( wordMatch( "Тест текст тест нечто Тест текст тест нечто", "текст", "ru_RU" ).matches ).toEqual( [ "текст", "текст" ] );
	} );

	it( "should match alternative whitespace", function() {
		expect( wordMatch( "focus&nbsp;keyword", "focus keyword", "en_US" ).count ).toBe( 1 );
		// Fixme: Find a way to undo normalization of spaces in matches field (for markings)
		expect( wordMatch( "focus&nbsp;keyword", "focus keyword", "en_US" ).matches ).toEqual( [ "focus keyword" ] );
	} );

	it( "should match he", function() {
		expect( wordMatch( "ל בעל", "ל בעל", "he_HE" ).count ).toBe( 1 );
		expect( wordMatch( "ל בעל", "ל בעל", "he_HE" ).matches ).toEqual( [ "ל בעל" ] );
		expect( wordMatch( "", "ל בעל", "he_HE" ).count ).toBe( 0 );
		expect( wordMatch( "", "ל בעל", "he_HE" ).matches ).toEqual( [] );
	} );

	it( "should match dashes in the keyword", function() {
		expect( wordMatch( "text key-word text", "key-word", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "text key-word text", "key-word", "en_US" ).matches ).toEqual( [ "key-word" ] );
		expect( wordMatch( "", "key-word", "en_US" ).count ).toBe( 0 );
		expect( wordMatch( "", "key-word", "en_US" ).matches ).toEqual( [] );
	} );

	it( "should match within special characters", function() {
		expect( wordMatch( "Sed <keyword» dictum", "keyword", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Sed <keyword» dictum", "keyword", "en_US" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "Sed «keyword> dictum", "keyword", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Sed «keyword> dictum", "keyword", "en_US" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "Sed ‹keyword› dictum", "keyword", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "Sed ‹keyword› dictum", "keyword", "en_US" ).matches ).toEqual( [ "keyword" ] );
		expect( wordMatch( "", "keyword", "en_US" ).count ).toBe( 0 );
		expect( wordMatch( "", "keyword", "en_US" ).matches ).toEqual( [] );
	} );

	it( "should match keyphrases comprised of multiple words. ", function() {
		expect( wordMatch( "text key word text", "key word", "en_US" ).count ).toBe( 1 );
		expect( wordMatch( "text key word text", "key word", "en_US" ).matches ).toEqual( [ "key word" ] );
	} );

	it( "should match keywords preceded by a punctuation mark.", function() {
		expect( wordMatch( "¿Como hacer guacamole?", "como", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "¿Como hacer guacamole?", "como", "es_ES" ).matches ).toEqual( [ "Como" ] );

		expect( wordMatch( "¿keyword.", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "¿keyword.", "keyword", "es_ES" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "¡keyword.", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "¡keyword.", "keyword", "es_ES" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "«keyword»", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "«keyword»", "keyword", "es_ES" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "(keyword)", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "(keyword)", "keyword", "es_ES" ).matches ).toEqual( [ "keyword" ] );

		expect( wordMatch( "-keyword", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "keyword-", "keyword", "es_ES" ).count ).toBe( 1 );
		expect( wordMatch( "-keyword-", "keyword", "es_ES" ).count ).toBe( 1 );
	} );

	it( "should not match words preceded/followed by a - in Indonesian", function() {
		expect( wordMatch( "buku-", "buku", "id_ID" ).count ).toBe( 0 );
		expect( wordMatch( "-buku", "buku", "id_ID" ).count ).toBe( 0 );
		expect( wordMatch( "-buku-", "buku", "id_ID" ).count ).toBe( 0 );
		expect( wordMatch( "buku-buku", "buku", "id_ID" ).count ).toBe( 0 );
	} );

	it( "matches forms containing a - in Indonesian", function() {
		expect( wordMatch( "buku-buku", "buku-buku", "id_ID" ).count ).toBe( 1 );
	} );

	it( "Should match words followed by RTL-specific punctuation marks", function() {
		// Arabic comma
		expect( wordMatch( "المقاومة،", "المقاومة", "ar_AE" ).count ).toBe( 1 );
		// Arabic question mark
		expect( wordMatch( "الجيدة؟", "الجيدة", "ar_AE" ).count ).toBe( 1 );
		// Arabic semicolon
		expect( wordMatch( "الجيدة؛", "الجيدة", "ar_AE" ).count ).toBe( 1 );
		// Urdu full stop
		expect( wordMatch( "گئے۔", "گئے", "ur" ).count ).toBe( 1 );
	} );

	it( "Should match Japanese words where the language specific helper to match text to word is used", function() {
		expect( wordMatch( "日帰りイベントを数回そして5泊6日の国内旅行を予定している。", "日帰り", "ja", matchWordCustomHelper  ).count ).toBe( 1 );
		expect( wordMatch( "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな者数。", "者数", "ja", matchWordCustomHelper ).count ).toBe( 2 );
	} );

	xit( "returns the index position of the matched Japanese word. This test is skipped for now as it returns an incorrect index " +
		"if there is an overlapping between the matched word and other words in the text, e.g 元気 and 元. In the test case below, " +
		"the correct index position should be 7, but it returns 0 instead.", () => {
		expect( wordMatch( "元気じゃ家じゃ元", "元", "ja", matchWordCustomHelper ).position ).toBe( 7 );
	} );

	xit( "returns the index position of the matched (English) word. This test is skipped for now as it returns an incorrect index " +
		"if there is an overlapping between the matched word and other words in the text, e.g 'working' and 'work'. In the test case below, " +
		"the correct index position should be 21, but it returns 6 instead.", () => {
		expect( wordMatch( "He is working on the work.", "work", "en" ).position ).toBe( 21 );
	} );
} );
