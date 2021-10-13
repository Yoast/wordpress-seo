import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/sv/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (infinitive)", function() {
		const paper = new Paper( "Jag behöver läsa boken.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: läsas
		const paper = new Paper( "Boken måste läsas.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (present)", function() {
		const paper = new Paper( "Jag läser boken.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: läses
		const paper = new Paper( "Boken läses av mig.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (past)", function() {
		// Passive: lästes
		const paper = new Paper( "Boken lästes av mig.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (past)", function() {
		const paper = new Paper( "Jag läste boken.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (supine)", function() {
		// Passive: lästs
		const paper = new Paper( "Boken har lästs av mig.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (supine)", function() {
		const paper = new Paper( "Jag har läst boken.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice (deponent verb)", function() {
		const paper = new Paper( "Jag hoppas du mår bra.", { locale: "sv_SE" } );
		expect( passiveVoice( paper, new Researcher( paper ) ).passives.length ).toBe( 0 );
	} );
} );
