import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/hu/Researcher";


describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		const paper = new Paper( "Teát iszom.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional without a prefix)", function() {
		// Passive: ültetve.
		const paper = new Paper( "Ha a vendégek ültetve lennének, nem lennének fáradtak.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	/*
	Imperative has not been implemented yet.
	it( "returns passive voice (imperative without a prefix)", function() {
		// Passive: Foglalj.
		const paper = new Paper( "Foglalj szobát holnapra.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
	it( "returns passive voice (imperative with a prefix)", function() {
		// Passive: Menj el.
		const paper = new Paper( "Menj el a boltba.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );*/

	it( "returns passive voice (conditional with a prefix)", function() {
		// Passive: el lenne ültetve.
		const paper = new Paper( "Ha el lenne ültetve a fa, lenne karácsonyfánk.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (morphological conditional present)", function() {
		// Passive: kikötődne.
		const paper = new Paper( "Ha kikötődne a cipőfűzőm futás közben, elesnék.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	/*
	Conditional past has not been implemented yet.
	it( "returns passive voice (morphological conditional past)", function() {
		// Passive: kikötődött volna.
		const paper = new Paper( "Ha kikötődött volna a cipőfűzőm, eleshettem volna futás közben.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );*/

	it( "returns passive voice (in -ra)", function() {
		// Passive: kiszállításra került.
		const paper = new Paper( "A csomag kiszállításra került.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -re)", function() {
		// Passive: kifizetésre került.
		const paper = new Paper( "A lakás ára kifizetésre került.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ódik without a prefix)", function() {
		// Passive: íródott.
		const paper = new Paper( "A levél 100 éve íródott.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ődik without a prefix)", function() {
		// Passive: töltődik.
		const paper = new Paper( "A telefon gyorsan töltődik.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ódik with a prefix)", function() {
		// Passive: megíródott.
		const paper = new Paper( "A könyv gyorsan megíródott.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ődik with a prefix)", function() {
		// Passive: beszennyeződött.
		const paper = new Paper( "A ruha beszennyeződött.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ódni)", function() {
		// Passive: fel fog hajtódni.
		const paper = new Paper( "A ruha fel fog hajtódni.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ődni)", function() {
		// Passive: meg fog töltődni.
		const paper = new Paper( "A kád meg fog betöltődni vízzel.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ve without a prefix)", function() {
		// Passive: van mosva.
		const paper = new Paper( "A függöny ki van mosva.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ve without a prefix)", function() {
		// Passive: festve van.
		const paper = new Paper( "Az ajó festve van.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -va without a prefix)", function() {
		// Passive: mázolva van.
		const paper = new Paper( "A kerítés mázolva van.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -ve with a prefix)", function() {
		// Passive: el vannak ültetve.
		const paper = new Paper( "El vannak ültetve a virágok.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -va with a prefix)", function() {
		// Passive: meg vagyok fázva.
		const paper = new Paper( "Meg vagyok fázva.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (sentences that start with a participle)", function() {
		// Passive: Mázolva van.
		const paper = new Paper( "Mázolva van a kerítés.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does not return passive voice (words that look like a passive but are not)", function() {
		// Non passive: mosómedve.
		const paper = new Paper( "A mosómedve vadászik az erdőben.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (sentences that start with a participle)", function() {
		// Passive: Megfinanszírozásra került.
		const paper = new Paper( "Megfinanszírozásra került a projekt.", { locale: "hu_HU" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
