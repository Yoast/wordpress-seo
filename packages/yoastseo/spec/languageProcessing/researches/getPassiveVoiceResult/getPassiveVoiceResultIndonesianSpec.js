import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/id/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		const paper = new Paper( "Seseorang melempar pemumpang itu ke luar.", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice", function() {
		const paper = new Paper( "Anwar sudah mendengar berita itu kemarin", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice", function() {
		// Passive: dilempar.
		const paper = new Paper( "Penumpang itu dilempar ke luar.", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice, does not break if the passive verb form is the first word in the sentence", function() {
		// Passive: ditinggal.
		const paper = new Paper( "Ditinggal ibu dan ayahnya sejak kecil, ia tinggal sebatang kara.", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: didengar.
		const paper = new Paper( "Berita itu sudah didengar oleh Anwar kemarin.", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: dilempar.
		const paper = new Paper( "Penumpang itu dilempar ke luar.", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does not return passive voice if the passive verb is preceded by 'untuk", function() {
		// Passive: digunakan.
		const paper = new Paper( "Kalimat itu lebih baik untuk digunakan", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if the word is found in the non-passive exception list", function() {
		// Non passive: dinosaurus.
		const paper = new Paper( "Saya melihat dinosaurus", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if non-passive exception has an additional suffix", function() {
		// Non passive: disiplinlah.
		const paper = new Paper( "Disiplinlah dalam menuntut ilmu", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if non-passive exception is shorter than 4 letters", function() {
		// Non passive: dia.
		const paper = new Paper( "Dia melanjutkan kuliahnya di Jakarta", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if non-passive exception is shorter than 4 letters", function() {
		// Non passive: dipan.
		const paper = new Paper( "Dia duduk di atas dipan", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive voice if non-passive exception has an additional suffix", function() {
		// Non passive: dindingnya.
		const paper = new Paper( "Rumah yang dindingnya berwarna hijau itu roboh", { locale: "id_ID" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
