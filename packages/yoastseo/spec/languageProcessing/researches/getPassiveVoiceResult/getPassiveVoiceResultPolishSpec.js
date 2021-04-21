import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/pl/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		const paper = new Paper( "Jem jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: jest jedzone
		const paper = new Paper( "Jabłko jest jedzone.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		const paper = new Paper( "Zjem jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future, auxiliary-participle order)", function() {
		// Passive: będzie zjedzone
		const paper = new Paper( "Jabłko będzie zjedzone.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (future, participle-auxiliary order)", function() {
		// Passive: zjedzone będzie
		const paper = new Paper( "Następnie zjedzone będzie jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		const paper = new Paper( "Zjadłam jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: zostało zjedzone
		const paper = new Paper( "Zostało zjedzone jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (infinitive)", function() {
		const paper = new Paper( "Trzeba jeść jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive, auxiliary-participle order)", function() {
		// Passive: zostać zjedzone
		const paper = new Paper( "Jabłko musi zostać zjedzone.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (infinitive, participle-auxiliary order)", function() {
		// Passive: zjedzone zostać
		const paper = new Paper( "Zjedzone musi zostać jabłko.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "moja" before "kochana".
		const paper = new Paper( "To jest moja kochana mama.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (indirect).", function() {
		// Exception words: 'może' before 'otwarte'
		const paper = new Paper( "Jak komuś jest gorąco to może doceniać szeroko otwarte okna.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice if an indirect precedence exception word appears after the first auxiliary, " +
		"but before the second auxiliary.", function() {
		// Exception word: musi; Auxiliaries: jest & być; Participle: zjedzone
		const paper = new Paper( "Jabłko jest pyszne więc musi być zjedzone.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice if there is an indirect precedence exception word in between the participle and " +
		"the auxiliary (other auxiliary).", function() {
		// Exception word: ma; Auxiliary: być; Participle: zjedzone
		const paper = new Paper( "Jabłko zjedzone ma być.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice if there is an indirect precedence exception word in between the participle and t" +
		"he auxiliary (reflexive pronoun).", function() {
		// Exception word: się; Auxiliary: była; Participle: drukowana
		const paper = new Paper( "Wersja drukowana ukazała się w zeszłym roku i była dostępna w sklepach od Marca.", { locale: "pl_PL" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
