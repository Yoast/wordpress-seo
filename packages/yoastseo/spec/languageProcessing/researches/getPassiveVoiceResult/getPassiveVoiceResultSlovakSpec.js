import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/sk/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "Vlak odchádza.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: sú leštené.
		var paper = new Paper( "Topánky sú leštené.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		var paper = new Paper( "Odídem skoro.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future)", function() {
		// Passive: bude uvarené.
		var paper = new Paper( "Jedlo bude včas uvarené.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		var paper = new Paper( "Túto úlohu študenti vykonali včera.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: bola zamietnutá.
		var paper = new Paper( "Jeho žiadosť bola zamietnutá.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: byť skontrolovaný.
		var paper = new Paper( "Chce byť skontrolovaný včas.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );
	it( "returns active voice if participle is in the non-passive exception list", function() {
		// Exception: pripravený
		var paper = new Paper( "Jedlo je hotové, stôl je pripravený.", { locale: "sk_SK" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );
} );
