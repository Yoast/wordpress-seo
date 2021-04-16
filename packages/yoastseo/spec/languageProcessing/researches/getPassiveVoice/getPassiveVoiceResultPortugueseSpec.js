import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/pt/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (presente)", function() {
		const paper = new Paper( "Eu como uma maçã.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (presente)", function() {
		// Passive: és aprovado.
		const paper = new Paper( "A decisão és aprovado por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (futuro)", function() {
		const paper = new Paper( "Eu comerei uma maçã.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (futuro)", function() {
		// Passive: será aprovado.
		const paper = new Paper( "A decisão será aprovado.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pretérito)", function() {
		const paper = new Paper( "Eu comera uma maçã.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pretérito)", function() {
		// Passive: fora aprovado.
		const paper = new Paper( "A decisão fora aprovado por mim", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present perfect)", function() {
		const paper = new Paper( "Eu tenho comido uma maça", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present perfect)", function() {
		// Passive: ha sido comida.
		const paper = new Paper( "Una maça ha sido comida por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imperfect)", function() {
		const paper = new Paper( "Yo comía una maça.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imperfect)", function() {
		// Passive: era comida.
		const paper = new Paper( "Una maça era comida por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (pluperfect)", function() {
		const paper = new Paper( "Eu tenho comido una maça.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (pluperfect)", function() {
		// Passive: tem sido comida.
		const paper = new Paper( "Una maça tem sido comida por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (conditional)", function() {
		const paper = new Paper( "Eu comeria una maça.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (conditional)", function() {
		// Passive: seria comida.
		const paper = new Paper( "Una maça seria comida por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present subjunctive)", function() {
		const paper = new Paper( "Eu coma una maça.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present subjunctive)", function() {
		// Passive: seja comida.
		const paper = new Paper( "Una maça seja comida por mim.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (infinitive)", function() {
		const paper = new Paper( "Yo devo comer una maça.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: ser comida.
		const paper = new Paper( "Una manzana deve ser comida por mim.", { locale: "es_ES" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "doesn't return passive voice if an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word: "o" after "é".
		const paper = new Paper( "É o capítulo preferido de vários membros da equipe de produção.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "doesn't return passive voice if a participle is marked as non-passive by a precedence exception (directly preceding).", function() {
		// Exception word: "um" before "sentido".
		const paper = new Paper( "Era um sentido monumental e bombástico.", { locale: "pt_PT" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );
} );
