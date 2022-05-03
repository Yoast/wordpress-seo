import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import russianSyllables from "../../../../../src/languageProcessing/languages/ru/config/syllables.json";

describe( "a syllable counter for Russian text strings", function() {
	it( "returns the number of syllables of Russian words", function() {
		expect( countSyllableFunction( "нет", russianSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "мама", russianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "сестрёнка", russianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "переиграть", russianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "переехал", russianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "переехали", russianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "почему-то", russianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "сияет", russianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "реэлтор", russianSyllables ) ).toBe( 3 );
	} );
} );
