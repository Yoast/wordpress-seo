import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/nb/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "De skal hjem.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: er bygget.
		var paper = new Paper( "Huset er bygget.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (future)", function() {
		var paper = new Paper( "Vi kommer snart hjem.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (future)", function() {
		// Passive: bli gjort.
		var paper = new Paper( "Oppgaven vil bli gjort.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		var paper = new Paper( "De ryddet huset grundig", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: ble kunngjort.
		var paper = new Paper( "De nye tiltakene ble kunngjort i går.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: být sledován.
		var paper = new Paper( "Problemet å bli lagt merke til.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice when cannotBeBetweenAuxiliaryAndPassive found", function() {
		// Exception: har
		var paper = new Paper( "Cameraet er her har vært vitne til oss.", { locale: "nb_NB" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );
} );
