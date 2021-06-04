import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/nl/Researcher";

/*
 * Note: for perfect tenses, Dutch uses the auxiliary `zijn`. Because it is difficult to distinguish between passives
 * and adjectival use of verbs when `zijn` is used, we only detect passives formed with `worden`.
 */

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		const paper = new Paper( "Ik eet een appel.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: wordt gegeten
		const paper = new Paper( "Een appel wordt gegeten.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		const paper = new Paper( "Hij zal een brief schrijven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future, auxiliary-participle order)", function() {
		// Passive: worden geschreven
		const paper = new Paper( "De brief zal worden geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (future, participle-auxiliary order)", function() {
		// Passive: geschreven worden
		const paper = new Paper( "De brief zal geschreven worden.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		const paper = new Paper( "Ik schreef een brief.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice (present perfect)", function() {
		const paper = new Paper( "Ik heb een brief geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice (past perfect)", function() {
		const paper = new Paper( "Ik had een brief geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: werd geschreven
		const paper = new Paper( "Een brief werd geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present, subordinate clause)", function() {
		const paper = new Paper( "Ik weet dat hij een brief schrijft.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present, subordinate clause)", function() {
		// Passive: wordt geschreven
		const paper = new Paper( "Ik weet dat een brief wordt geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect, subordinate clause, auxiliary-participle order)", function() {
		const paper = new Paper( "Ik weet dat hij een brief heeft geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice (present perfect, subordinate clause, participle-auxiliary order)", function() {
		const paper = new Paper( "Ik weet dat hij een brief geschreven heeft.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect, subordinate clause, participle-auxiliary order)", function() {
		// Passive: geschreven werd
		const paper = new Paper( "Ik weet dat een brief geschreven werd.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (imperfect, subordinate clause, auxiliary-participle order)", function() {
		// Passive: werd geschreven
		const paper = new Paper( "Ik weet dat een brief werd geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future, subordinate clause, auxiliary-participle order", function() {
		const paper = new Paper( "Ik weet dat hij een brief zal schrijven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future, subordinate clause, auxiliary-participle order", function() {
		// Passive: zal worden geschreven
		const paper = new Paper( "Ik weet dat een brief zal worden geschreven.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (future, subordinate clause, participle-auxiliary order", function() {
		// Passive: geschreven zal worden
		const paper = new Paper( "Ik weet dat een brief geschreven zal worden.", { locale: "nl_NL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
