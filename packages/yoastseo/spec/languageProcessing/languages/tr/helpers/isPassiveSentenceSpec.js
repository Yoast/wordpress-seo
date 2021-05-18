import isPassiveSentence from "../../../../../src/languageProcessing/languages/tr/helpers/isPassiveSentence.js";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		expect( isPassiveSentence( "Bu sabah okula yürüdü" ) ).toBe( false );
		expect( isPassiveSentence( "Haberleri yarın dinleyeceğiz." ) ).toBe( false );
	} );

	it( "returns passive voice", function() {
		// Passive: görüldü.
		expect( isPassiveSentence( "O, dün buralarda görüldü." ) ).toBe( true );
		// Passive: gönderilecek.
		expect( isPassiveSentence( "Çocuk  yurtdışına gönderilecek." ) ).toBe( true );
		// Passive: alındı.
		expect( isPassiveSentence( "O sandalyeler satın alındı." ) ).toBe( true );
		// Passive: temizlendi.
		expect( isPassiveSentence( "Camlar dün temizlendi." ) ).toBe( true );
	} );

	it( "does not return passive voice if the word is found in the non-passive full forms exception list", function() {
		// Non passive: sonuçlanır.
		expect( isPassiveSentence( "Aslında sanırım bu sayede daha az hapis cezasıyla sonuçlanır" ) ).toBe( false );
		// Non passive: kullanmak.
		expect( isPassiveSentence( "Sanırım konuştuğumuz aracı kullanmak için hazırım" ) ).toBe( false );
	} );

	it( "does not return passive voice if the word is found in the non-passive stems exception list", function() {
		// Non passive: gezindik, stem: gezi
		expect( isPassiveSentence( "Biz şehirde gezindik" ) ).toBe( false );
	} );
} );
