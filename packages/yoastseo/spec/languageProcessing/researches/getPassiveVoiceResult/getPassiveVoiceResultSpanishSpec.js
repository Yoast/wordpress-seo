import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import SpanishResearcher from "../../../../src/languageProcessing/languages/es/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (presente)", function() {
		const paper = new Paper( "Yo como una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (presente)", function() {
		// Passive: es comida.
		const paper = new Paper( "Una manzana es comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (futuro)", function() {
		const paper = new Paper( "Yo comeré una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (futuro)", function() {
		// Passive: será comida.
		const paper = new Paper( "Una manzana será comida por mí ." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pretérito)", function() {
		const paper = new Paper( "Yo comí una manzana.", { locale: "es_ES" } );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pretérito)", function() {
		// Passive: fue comida.
		const paper = new Paper( "Una manzana fue comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect)", function() {
		const paper = new Paper( "Yo he comido una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present perfect)", function() {
		// Passive: ha sido comida.
		const paper = new Paper( "Una manzana ha sido comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		const paper = new Paper( "Yo comía una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: era comida.
		const paper = new Paper( "Una manzana era comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pluperfect)", function() {
		const paper = new Paper( "Yo había comido una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pluperfect)", function() {
		// Passive: había sido comida.
		const paper = new Paper( "Una manzana había sido comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (conditional)", function() {
		const paper = new Paper( "Yo comería una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional)", function() {
		// Passive: sería comida.
		const paper = new Paper( "Una manzana sería comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present subjunctive)", function() {
		const paper = new Paper( "Yo coma una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present subjunctive)", function() {
		// Passive: sea comida.
		const paper = new Paper( "Una manzana sea comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (infinitive)", function() {
		const paper = new Paper( "Yo debo comer una manzana." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: ser comida.
		const paper = new Paper( "Una manzana debe ser comida por mí." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word: "el" after "es".
		const paper = new Paper( "Es el capítulo preferido de constios miembros del equipo de producción." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "un" before "sentido".
		const paper = new Paper( "Fue un sentido monumental y grandilocuente." );
		const researcher = new SpanishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
