import countSyllableFunction from "../../../src/stringProcessing/syllables/count.js";

describe( "a syllable counter for Russian text strings", function() {
	it( "returns the number of syllables of Russian words", function() {
		expect( countSyllableFunction( "нет", "ru_RU" ) ).toBe( 1 );
		expect( countSyllableFunction( "мама", "ru_RU" ) ).toBe( 2 );
		expect( countSyllableFunction( "сестрёнка", "ru_RU" ) ).toBe( 3 );
		expect( countSyllableFunction( "переиграть", "ru_RU" ) ).toBe( 4 );
		expect( countSyllableFunction( "переехал", "ru_RU" ) ).toBe( 4 );
		expect( countSyllableFunction( "переехали", "ru_RU" ) ).toBe( 5 );
		expect( countSyllableFunction( "почему-то", "ru_RU" ) ).toBe( 4 );
		expect( countSyllableFunction( "сияет", "ru_RU" ) ).toBe( 3 );
		expect( countSyllableFunction( "реэлтор", "ru_RU" ) ).toBe( 3 );
	} );
} );
