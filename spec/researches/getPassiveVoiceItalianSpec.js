var passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "Io mangio una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: è mangiata
		var paper = new Paper( "Una mela è mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		var paper = new Paper( "Io mangerò una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future)", function() {
		// Passive: sarà mangiata
		var paper = new Paper( "Una mela sarà mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (passato remoto)", function() {
		var paper = new Paper( "Io mangiai una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (passato remoto)", function() {
		// Passive: fu mangiata
		var paper = new Paper( "Una mela fu mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect)", function() {
		var paper = new Paper( "Io ho mangiato una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present perfect)", function() {
		// Passive: è stata mangiata.
		var paper = new Paper( "Una mela è stata mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		var paper = new Paper( "Io mangiavo una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: era mangiata
		var paper = new Paper( "Una mela era mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (trapassato prossimo)", function() {
		var paper = new Paper( "Io avevo mangiato una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (trapassato prossimo)", function() {
		// Passive: era stata mangiata
		var paper = new Paper( "Una mela era stata mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (conditional)", function() {
		var paper = new Paper( "Io mangerei una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional)", function() {
		// Passive: sarebbe stata mangiata
		var paper = new Paper( "Una mela sarebbe stata mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );


	it( "returns passive voice (infinitive)", function() {
		var paper = new Paper( "Io devo mangiare una mela.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: essere mangiata
		var paper = new Paper( "Una mela deve essere mangiata da me.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word: "il" after "è".
		var paper = new Paper( "È il capitolo preferito di diversi membri del team di produzione.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "un" before "macchiato".
		var paper = new Paper( "Lei ordinerà un macchiato.", { locale: "it_IT" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );
} );
