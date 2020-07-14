import countSyllableFunction from "../../../src/stringProcessing/syllables/count.js";

describe( "a syllable counter for Portuguese text strings", function() {
	it( "returns the number of syllables of words containing the substract syllable (gu|qu)[aeoáéíóúêã]", function() {
		expect( countSyllableFunction( "aquário", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "guarda", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "bosque", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "aguerrido", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "inquérito", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "biquíni", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "quórum", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "quanto", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "alíquota", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "ambíguo", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "jaraguá", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "linguística", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "alguém", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "quântico", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "sequência", "pt_PT" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the substract syllable cia$", function() {
		expect( countSyllableFunction( "presidência", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "essência", "pt_PT" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the add syllable [aeiouáéíóúàâêôü][aeo]", function() {
		expect( countSyllableFunction( "saia", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "história", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "série", "pt_PT" ) ).toBe( 2 );
		expect( countSyllableFunction( "indivíduo", "pt_PT" ) ).toBe( 4 );
	} );
	it( "returns the number of syllables of words containing the add syllable [aeiou][íúáéãê]", function() {
		expect( countSyllableFunction( "paraíba", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "veículos", "pt_PT" ) ).toBe( 4 );
		expect( countSyllableFunction( "suécia", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "oásis", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "saúde", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "diário", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "sutiã", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "experiêncial", "pt_PT" ) ).toBe( 6 );
	} );
	it( "returns the number of syllables of words containing the add syllable aí[ae]", function() {
		expect( countSyllableFunction( "baía", "pt_PT" ) ).toBe( 3 );
		expect( countSyllableFunction( "saíeis", "pt_PT" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ão", function() {
		expect( countSyllableFunction( "saguão", "pt_PT" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ui", function() {
		expect( countSyllableFunction( "anuir", "pt_PT" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ai", function() {
		expect( countSyllableFunction( "arrais", "pt_PT" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words from the exclusion full words list", function() {
		expect( countSyllableFunction( "delegacia, democracia", "pt_PT" ) ).toBe( 10 );
	} );
} );
