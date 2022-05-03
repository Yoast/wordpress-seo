import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import spanishSyllables from "../../../../../src/languageProcessing/languages/es/config/syllables.json";

describe( "a syllable counter for Spanish text strings", function() {
	it( "returns the number of syllables of words containing the add syllable i[ií]", function() {
		expect( countSyllableFunction( "chiita", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "chií", spanishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [íú][aeo]", function() {
		expect( countSyllableFunction( "astrología", spanishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "hematíe", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "avío", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "búa", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "lúe", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "avalúo", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[aáeéíóú]", function() {
		expect( countSyllableFunction( "anoa", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "coágulo", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aloe", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "poética", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "egoísmo", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "oósfera", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "noúmeno", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable uu", function() {
		expect( countSyllableFunction( "duunvir", spanishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable flu[iea]", function() {
		expect( countSyllableFunction( "fluir", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "afluente", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ru[ie]", function() {
		expect( countSyllableFunction( "ruido", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "prueba", spanishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eio", function() {
		expect( countSyllableFunction( "meiosis", spanishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eu[aá]", function() {
		expect( countSyllableFunction( "cleuasmo", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "fideuá", spanishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oi[aó]", function() {
		expect( countSyllableFunction( "paranoia", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "termoiónico", spanishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [iu]ei", function() {
		expect( countSyllableFunction( "vieira", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "queimada", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[éu]", function() {
		expect( countSyllableFunction( "quién", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "braquiuro", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[éu]", function() {
		expect( countSyllableFunction( "quién", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "braquiuro", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^anti[aeoá]", function() {
		expect( countSyllableFunction( "antiaéreo", spanishSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "antieconómico", spanishSyllables ) ).toBe( 7 );
		expect( countSyllableFunction( "antioquia", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "antiácido", spanishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^zoo", function() {
		expect( countSyllableFunction( "zoológico", spanishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable coo", function() {
		expect( countSyllableFunction( "cooperación", spanishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable microo", function() {
		expect( countSyllableFunction( "microondas", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eéó][aáeéíoóú]", function() {
		expect( countSyllableFunction( "agrear", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "teátrico", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "creer", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "feérico", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "proteína", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aseo", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "anteón", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "feúra", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "océano", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "nucléolo", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bóer", spanishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aáü][aáeéiíoóú]", function() {
		expect( countSyllableFunction( "contraataque", spanishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "abaá", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "caer", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "aéreo", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aire", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "maíz", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "cacao", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "faraón", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "baúl", spanishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "afrikáans", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "arráez", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "bonsái", spanishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "agüela", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aconcagüino", spanishSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "güérmeces", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoi", function() {
		expect( countSyllableFunction( "geoide", spanishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeu", function() {
		expect( countSyllableFunction( "indoeuropeo", spanishSyllables ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]au", function() {
		expect( countSyllableFunction( "meauca", spanishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aguaucle", spanishSyllables ) ).toBe( 4 );
	} );
} );
