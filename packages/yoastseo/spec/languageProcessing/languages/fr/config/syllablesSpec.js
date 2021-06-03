import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import frenchSyllables from "../../../../../src/languageProcessing/languages/fr/config/syllables.json";

describe( "a syllable counter for French text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable [ptf]aon(ne)?s?$", function() {
		expect( countSyllableFunction( "taons", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "faon", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "paonne", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "paonnes", frenchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aoul", function() {
		expect( countSyllableFunction( "saoul", frenchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^eéiou]e(s|nt)?$", function() {
		expect( countSyllableFunction( "chance", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "chances", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "dormirent", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [qg]ue(s|nt)?$", function() {
		expect( countSyllableFunction( "manque", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "masques", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "manquent", frenchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "fatigue", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "analogues", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "fatiguent", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[ëaéèï]", function() {
		expect( countSyllableFunction( "noël", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "oasis", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "poétique", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "poème", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "coïncider", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "taoïsme", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable a[eéèïüo]", function() {
		expect( countSyllableFunction( "maestro", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "aéroporte", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aère", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "haïs", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "capharnaüm", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "extraordinaire", frenchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable é[aâéîiuo]", function() {
		expect( countSyllableFunction( "idéal", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "théâtre", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "agréés", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "obéir", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "réunit", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "vidéo", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii[oe]", function() {
		expect( countSyllableFunction( "oubliions", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "riiez", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeéuo]y[aâeéèoui]", function() {
		expect( countSyllableFunction( "moyen", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "ennuyé", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "tuyau", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ouaoua", function() {
		expect( countSyllableFunction( "ouaouaron", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable coe", function() {
		expect( countSyllableFunction( "coexiste", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable zoo", function() {
		expect( countSyllableFunction( "zoologique", frenchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable coop", function() {
		expect( countSyllableFunction( "coopérer", frenchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable coord", function() {
		expect( countSyllableFunction( "coordination", frenchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable poly[ae]", function() {
		expect( countSyllableFunction( "polyester", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "polyamide", frenchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcd]ry[oa]", function() {
		expect( countSyllableFunction( "embryon", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "cryogénie", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "dryade", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcdfgptv][rl](ou|u|i)[aéèouâ]", function() {
		expect( countSyllableFunction( "afflua", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "pliât", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "oublié", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "ouvrière", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "crions", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "obstrué", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "flouant", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ouez", function() {
		expect( countSyllableFunction( "louez", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [blmnt]uio", function() {
		expect( countSyllableFunction( "distribuions", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "excluions", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "continuions", frenchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "remuions", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "tuions", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uoia", function() {
		expect( countSyllableFunction( "séquoia", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ment$", function() {
		expect( countSyllableFunction( "heureusement", frenchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable yua", function() {
		expect( countSyllableFunction( "yuan", frenchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcdfgptv][rl](i|u|eu)e([ltz]|r[s]?$|n[^t])",
		function() {
			expect( countSyllableFunction( "bleuette", frenchSyllables ) ).toBe( 2 );
			expect( countSyllableFunction( "crier", frenchSyllables ) ).toBe( 2 );
			expect( countSyllableFunction( "obstruez", frenchSyllables ) ).toBe( 3 );
			expect( countSyllableFunction( "tabliers", frenchSyllables ) ).toBe( 3 );
			expect( countSyllableFunction( "cruelles", frenchSyllables ) ).toBe( 2 );
			expect( countSyllableFunction( "tabliers", frenchSyllables ) ).toBe( 3 );
			expect( countSyllableFunction( "fluence", frenchSyllables ) ).toBe( 2 );
		} );

	it( "returns the number of syllables of words containing the add syllable [^aeiuyàâéèêëîïûüùôæœqg]uie[rz]$", function() {
		expect( countSyllableFunction( "saluiez", frenchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "insinuiez", frenchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "hétaïre", frenchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "cloueront", frenchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "écroueront", frenchSyllables ) ).toBe( 3 );
	} );
} );
