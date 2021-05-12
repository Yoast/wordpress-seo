import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import portugueseSyllables from "../../../../../src/languageProcessing/languages/pt/config/syllables.json";

describe( "a syllable counter for Portuguese text strings", function() {
	it( "returns the number of syllables of words containing the substract syllable (gu|qu)[aeoáéíóúêã]", function() {
		expect( countSyllableFunction( "aquário", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "guarda", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "bosque", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "aguerrido", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "inquérito", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "biquíni", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "quórum", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "quanto", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "alíquota", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "ambíguo", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "jaraguá", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "linguística", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "alguém", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "quântico", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "sequência", portugueseSyllables ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the substract syllable cia$", function() {
		expect( countSyllableFunction( "presidência", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "essência", portugueseSyllables ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the add syllable [aeiouáéíóúàâêôü][aeo]", function() {
		expect( countSyllableFunction( "saia", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "história", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "série", portugueseSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "indivíduo", portugueseSyllables ) ).toBe( 4 );
	} );
	it( "returns the number of syllables of words containing the add syllable [aeiou][íúáéãê]", function() {
		expect( countSyllableFunction( "paraíba", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "veículos", portugueseSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "suécia", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "oásis", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "saúde", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "diário", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "sutiã", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "experiêncial", portugueseSyllables ) ).toBe( 6 );
	} );
	it( "returns the number of syllables of words containing the add syllable aí[ae]", function() {
		expect( countSyllableFunction( "baía", portugueseSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "saíeis", portugueseSyllables ) ).toBe( 3 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ão", function() {
		expect( countSyllableFunction( "saguão", portugueseSyllables ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ui", function() {
		expect( countSyllableFunction( "anuir", portugueseSyllables ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the diphthong syllable ai", function() {
		expect( countSyllableFunction( "arrais", portugueseSyllables ) ).toBe( 2 );
	} );
} );
