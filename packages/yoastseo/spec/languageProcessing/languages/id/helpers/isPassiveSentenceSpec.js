import isPassiveSentence from "../../../../../src/languageProcessing/languages/id/helpers/isPassiveSentence.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		expect( isPassiveSentence( "Seseorang melempar pemumpang itu ke luar." ) ).toBe( false );
	} );

	it( "returns active voice", function() {
		expect( isPassiveSentence( "Anwar sudah mendengar berita itu kemarin" ) ).toBe( false );
	} );

	it( "returns passive voice", function() {
		// Passive: dilempar.
		expect( isPassiveSentence( "Penumpang itu dilempar ke luar." ) ).toBe( true );
	} );

	it( "returns passive voice, does not break if the passive verb form is the first word in the sentence", function() {
		// Passive: ditinggal.
		expect( isPassiveSentence( "Ditinggal ibu dan ayahnya sejak kecil, ia tinggal sebatang kara." ) ).toBe( true );
	} );

	it( "returns passive voice", function() {
		// Passive: didengar.
		expect( isPassiveSentence( "Berita itu sudah didengar oleh Anwar kemarin." ) ).toBe( true );
	} );

	it( "does not return passive voice if the passive verb is preceded by 'untuk'", function() {
		// Passive: digunakan.
		expect( isPassiveSentence( "Kalimat itu lebih baik untuk digunakan" ) ).toBe( false );
	} );

	it( "does not return passive voice if the word is found in the non-passive exception list", function() {
		// Non passive: dinosaurus.
		expect( isPassiveSentence( "Saya melihat dinosaurus" ) ).toBe( false );
	} );

	it( "does not return passive voice if non-passive exception has an additional suffix", function() {
		// Non passive: disiplinlah.
		expect( isPassiveSentence( "Disiplinlah dalam menuntut ilmu" ) ).toBe( false );
	} );

	it( "does not return passive voice if non-passive exception is shorter than 4 letters", function() {
		// Non passive: dia.
		expect( isPassiveSentence( "Dia melanjutkan kuliahnya di Jakarta" ) ).toBe( false );
	} );

	it( "does not return passive voice if non-passive exception is shorter than 4 letters", function() {
		// Non passive: dipan.
		expect( isPassiveSentence( "Dia duduk di atas dipan" ) ).toBe( false );
	} );

	it( "does not return passive voice if non-passive exception has an additional suffix", function() {
		// Non passive: dindingnya.
		expect( isPassiveSentence( "Rumah yang dindingnya berwarna hijau itu roboh" ) ).toBe( false );
	} );
} );
