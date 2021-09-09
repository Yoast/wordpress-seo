import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/fa/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		const paper = new Paper( ".آنها شرایط را تغییر دادند", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice", function() {
		const paper = new Paper( ".من در را باز می کنم", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice", function() {
		// Passive: ربوده.
		const paper = new Paper( ".او ربوده شد", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: گشوده شد.
		const paper = new Paper( ".موضوع گشوده شد", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: رفته
		const paper = new Paper( ".غذا رفته است", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for compound verbs", function() {
		// Passive: زمین خورده
		const paper = new Paper( ".امپراطوری زمین خورده", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for compound verbs", function() {
		// Passive: خبردار شده
		const paper = new Paper( ".دانش آموز خبردار شده", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for compound verbs", function() {
		// Passive: کشته شده بود
		const paper = new Paper( ".کارمند کشته شده بود", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for compound verbs", function() {
		// Passive: شکانده شده است
		const paper = new Paper( ".شیشه شکانده شده است", { locale: "fa" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
