import passiveVoice from "../../src/researches/getPassiveVoice.js";
import Paper from "../../src/values/Paper.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (presente)", function() {
		var paper = new Paper( "Yo como una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (presente)", function() {
		// Passive: es comida.
		var paper = new Paper( "Una manzana es comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (futuro)", function() {
		var paper = new Paper( "Yo comeré una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (futuro)", function() {
		// Passive: será comida.
		var paper = new Paper( "Una manzana será comida por mí .", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pretérito)", function() {
		var paper = new Paper( "Yo comí una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pretérito)", function() {
		// Passive: fue comida.
		var paper = new Paper( "Una manzana fue comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect)", function() {
		var paper = new Paper( "Yo he comido una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present perfect)", function() {
		// Passive: ha sido comida.
		var paper = new Paper( "Una manzana ha sido comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		var paper = new Paper( "Yo comía una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: era comida.
		var paper = new Paper( "Una manzana era comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pluperfect)", function() {
		var paper = new Paper( "Yo había comido una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pluperfect)", function() {
		// Passive: había sido comida.
		var paper = new Paper( "Una manzana había sido comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (conditional)", function() {
		var paper = new Paper( "Yo comería una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional)", function() {
		// Passive: sería comida.
		var paper = new Paper( "Una manzana sería comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present subjunctive)", function() {
		var paper = new Paper( "Yo coma una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present subjunctive)", function() {
		// Passive: sea comida.
		var paper = new Paper( "Una manzana sea comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (infinitive)", function() {
		var paper = new Paper( "Yo debo comer una manzana.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: ser comida.
		var paper = new Paper( "Una manzana debe ser comida por mí.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word: "el" after "es".
		var paper = new Paper( "Es el capítulo preferido de varios miembros del equipo de producción.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "un" before "sentido".
		var paper = new Paper( "Fue un sentido monumental y grandilocuente.", { locale: "es_ES" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );
} );
