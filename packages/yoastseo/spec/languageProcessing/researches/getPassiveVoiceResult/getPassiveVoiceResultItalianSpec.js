import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/it/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		const paper = new Paper( "Io mangio una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: viene mangiata
		const paper = new Paper( "Una mela viene mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		const paper = new Paper( "Io mangerò una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future)", function() {
		// Passive: verrà mangiata
		const paper = new Paper( "Una mela verrà mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (passato remoto)", function() {
		const paper = new Paper( "Io mangiai una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (passato remoto)", function() {
		// Passive: fu mangiata
		const paper = new Paper( "Una mela fu mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect)", function() {
		const paper = new Paper( "Io ho mangiato una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present perfect)", function() {
		// Passive: è stata mangiata.
		const paper = new Paper( "Una mela è stata mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		const paper = new Paper( "Io mangiavo una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: venisse mangiata
		const paper = new Paper( "Una mela venisse mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (trapassato prossimo)", function() {
		const paper = new Paper( "Io avevo mangiato una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (trapassato prossimo)", function() {
		// Passive: era stata mangiata
		const paper = new Paper( "Una mela era stata mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (conditional)", function() {
		const paper = new Paper( "Io mangerei una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional)", function() {
		// Passive: sarebbe stata mangiata
		const paper = new Paper( "Una mela sarebbe stata mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );


	it( "returns passive voice (infinitive)", function() {
		const paper = new Paper( "Io devo mangiare una mela.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: venire mangiata
		const paper = new Paper( "Una mela deve venire mangiata da me.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word: "il" after "stato".
		const paper = new Paper( "È stato il capitolo preferito di diversi membri del team di produzione.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "un" before "macchiato".
		const paper = new Paper( "C'è sempre stato un macchiato.", { locale: "it_IT" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
