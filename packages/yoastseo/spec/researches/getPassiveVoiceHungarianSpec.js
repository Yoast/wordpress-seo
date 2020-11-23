import passiveVoice from "../../src/researches/getPassiveVoice.js";
import Paper from "../../src/values/Paper.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "Yalmát eszem.", { locale: "hu_HU" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (infinitive)", function() {
		// Passive: Be van fejezve.
		var paper = new Paper( "Una manzana be van fejezve.", { locale: "hu_HU" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice (in -re)", function() {
		// Passive: Aktiválásra.
		var paper = new Paper( "Una manzana aktiválásra kerül.", { locale: "hu_HU" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	// it( "returns passive voice", function() {
	// 	// Passive: összeállítódik.
	// 	const paper = new Paper( "Una manzana összeállítódik.", { locale: "hu_HU" } );
	// 	expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	// } );
	// it( "returns active voice", function() {
	// 	const paper = new Paper( "Eszem egy pohár joghurtot", { locale: "hu_HU" } );
	// 	expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	// } );
	// it( "returns passive voice", function() {
	// 	// Passive: .
	// 	const paper = new Paper( "Eszem egy pohár joghurtot átnéződöm", { locale: "hu_HU" } );
	// 	expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	// } );
} );
