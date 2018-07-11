let countSyllableFunction = require( "../../../js/stringProcessing/syllables/count.js" );

describe( "a syllable counter for Spanish text strings", function() {
	it( "returns the number of syllables of words containing the add syllable i[ií]", function() {
		expect( countSyllableFunction( "chiita", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "chií", "es_ES" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [íú][aeo]", function() {
		expect( countSyllableFunction( "astrología", "es_ES" ) ).toBe( 5 );
		expect( countSyllableFunction( "hematíe", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "avío", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "búa", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "lúe", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "avalúo", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[aáeéíóú]", function() {
		expect( countSyllableFunction( "anoa", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "coágulo", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "aloe", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "poética", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "egoísmo", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "oósfera", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "noúmeno", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable uu", function() {
		expect( countSyllableFunction( "duunvir", "es_ES" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable flu[iea]", function() {
		expect( countSyllableFunction( "fluir", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "afluente", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ru[ie]", function() {
		expect( countSyllableFunction( "ruido", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "prueba", "es_ES" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eio", function() {
		expect( countSyllableFunction( "meiosis", "es_ES" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eu[aá]", function() {
		expect( countSyllableFunction( "cleuasmo", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "fideuá", "es_ES" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oi[aó]", function() {
		expect( countSyllableFunction( "paranoia", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "termoiónico", "es_ES" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [iu]ei", function() {
		expect( countSyllableFunction( "vieira", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "queimada", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[éu]", function() {
		expect( countSyllableFunction( "quién", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "braquiuro", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[éu]", function() {
		expect( countSyllableFunction( "quién", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "braquiuro", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^anti[aeoá]", function() {
		expect( countSyllableFunction( "antiaéreo", "es_ES" ) ).toBe( 6 );
		expect( countSyllableFunction( "antieconómico", "es_ES" ) ).toBe( 7 );
		expect( countSyllableFunction( "antioquia", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "antiácido", "es_ES" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^zoo", function() {
		expect( countSyllableFunction( "zoológico", "es_ES" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable coo", function() {
		expect( countSyllableFunction( "cooperación", "es_ES" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable microo", function() {
		expect( countSyllableFunction( "microondas", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eéó][aáeéíoóú]", function() {
		expect( countSyllableFunction( "agrear", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "teátrico", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "creer", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "feérico", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "proteína", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "aseo", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "anteón", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "feúra", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "océano", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "nucléolo", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "bóer", "es_ES" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aáü][aáeéiíoóú]", function() {
		expect( countSyllableFunction( "contraataque", "es_ES" ) ).toBe( 5 );
		expect( countSyllableFunction( "abaá", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "caer", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "aéreo", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "aire", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "maíz", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "cacao", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "faraón", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "baúl", "es_ES" ) ).toBe( 2 );
		expect( countSyllableFunction( "afrikáans", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "arráez", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "bonsái", "es_ES" ) ).toBe( 3 );
		expect( countSyllableFunction( "agüela", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "aconcagüino", "es_ES" ) ).toBe( 6 );
		expect( countSyllableFunction( "güérmeces", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoi", function() {
		expect( countSyllableFunction( "geoide", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeu", function() {
		expect( countSyllableFunction( "indoeuropeo", "es_ES" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]au", function() {
		expect( countSyllableFunction( "meauca", "es_ES" ) ).toBe( 4 );
		expect( countSyllableFunction( "aguaucle", "es_ES" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words from the exclusion full words list", function() {
		expect( countSyllableFunction( "y, scooter, via, beat, ok", "es_ES" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing words from the global fragments", function() {
		expect( countSyllableFunction( "business, free, nouveau, training", "es_ES" ) ).toBe( 7 );
	} );
} );
