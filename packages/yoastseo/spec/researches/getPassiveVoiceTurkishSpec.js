import passiveVoice from "../../src/researches/getPassiveVoice.js";
import Paper from "../../src/values/Paper.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		const paper = new Paper( "Bu sabah okula yürüdü", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice", function() {
		const paper = new Paper( "Haberleri yarın dinleyeceğiz.", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice", function() {
		// Passive: görüldü.
		const paper = new Paper( "O, dün buralarda görüldü.", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: gönderilecek.
		const paper = new Paper( "Çocuk  yurtdışına gönderilecek.", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: alındı.
		const paper = new Paper( "O sandalyeler satın alındı.", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: temizlendi.
		const paper = new Paper( "Camlar dün temizlendi.", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "does not return passive voice if the word is found in the non-passive full forms exception list", function() {
		// Non passive: sonuçlanır.
		const paper = new Paper( "Aslında sanırım bu sayede daha az hapis cezasıyla sonuçlanır", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if the word is found in the non-passive full forms exception list", function() {
		// Non passive: kullanmak.
		const paper = new Paper( "Sanırım konuştuğumuz aracı kullanmak için hazırım", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if the word is found in the non-passive stems exception list", function() {
		// Non passive: gezindik, stem: gezi
		const paper = new Paper( "Biz şehirde gezindik", { locale: "tr_TR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );
} );
