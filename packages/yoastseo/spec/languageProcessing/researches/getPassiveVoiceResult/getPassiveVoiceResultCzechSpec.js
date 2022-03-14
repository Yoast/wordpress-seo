import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/cs/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "Opouštíme domov.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: je diskutováno.
		var paper = new Paper( "Téma je diskutováno týmem.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		var paper = new Paper( "Let odletí včas.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future)", function() {
		// Passive: bude zpracován.
		var paper = new Paper( "Projev bude zpracován publikem.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		var paper = new Paper( "Student dokončil tuto knihu včera.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: byly přijaty.
		var paper = new Paper( "Přihlášky nových studentů byly přijaty.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: být sledován.
		var paper = new Paper( "Nebylo spravedlivé být neustále sledován.", { locale: "cz_CZ" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );
} );
