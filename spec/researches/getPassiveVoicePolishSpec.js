const passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
const Paper = require( "../../js/values/Paper.js" );

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		const paper = new Paper( "Jem jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: jest jedzone
		const paper = new Paper( "Jabłko jest jedzone.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		const paper = new Paper( "Zjem jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future, auxiliary-participle order)", function() {
		// Passive: będzie zjedzone
		const paper = new Paper( "Jabłko będzie zjedzone.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (future, participle-auxiliary order)", function() {
		// Passive: zjedzone będzie
		const paper = new Paper( "Następnie zjedzone będzie jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		const paper = new Paper( "Zjadłam jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: zostało zjedzone
		const paper = new Paper( "Zostało zjedzone jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (infinitive)", function() {
		const paper = new Paper( "Trzeba jeść jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive, auxiliary-participle order)", function() {
		// Passive: zostać zjedzone
		const paper = new Paper( "Jabłko musi zostać zjedzone.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (infinitive, participle-auxiliary order)", function() {
		// Passive: zjedzone zostać
		const paper = new Paper( "Zjedzone musi zostać jabłko.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "moja" before "kochana".
		const paper = new Paper( "To jest moja kochana mama.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception.", function() {
		// Exception words: może & mieć
		const paper = new Paper( "Jak komuś jest gorąco to może mieć szeroko otwarte okna.", { locale: "pl_PL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );
} );
