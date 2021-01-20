import { modifyStem, isVowelDoublingAllowed } from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/stemModificationHelpers";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;
const stemmingExceptions = morphologyDataNL.regularStemmer.stemModifications.exceptionsStemModifications;
const verbPrefixes = morphologyDataNL.pastParticipleStemmer.compoundVerbsPrefixes;

describe( "Test for applying stem modifications to Dutch words", () => {
	it( "modifies a stem if matched by one of the modification regexes", () => {
		expect( modifyStem( "katt", morphologyDataNL.regularStemmer.stemModifications.finalChanges ) ).toBe( "kat" );
	} );
	it( "returns the input stem if the word is not matched with any of the modification regexes ", () => {
		expect( modifyStem( "hond", morphologyDataNL.regularStemmer.stemModifications.finalChanges ) ).toBe( "hond" );
	} );
} );

describe( "Test for checking whether the final vowel of a Dutch stem should be doubled", () => {
	it( "returns true if the stem is on the exception list of words that should have the vowel doubled", () => {
		expect( isVowelDoublingAllowed( "blokker", stemmingExceptions, verbPrefixes ) ).toBe( true );
	} );
	it( "returns false if the vowel is preceded by a double consonant and is not on the exception list", () => {
		expect( isVowelDoublingAllowed( "luttel", stemmingExceptions, verbPrefixes ) ).toBe( false );
	} );
	it( "returns false if the stem is a compound noun the base form of which is on the list of stems that should not get vowel doubling", () => {
		expect( isVowelDoublingAllowed( "eettafel", stemmingExceptions, verbPrefixes ) ).toBe( false );
	} );
	it( "returns false if the stem is a compound verb stem the base form of which is on the list of verbs that should not get vowel doubling", () => {
		expect( isVowelDoublingAllowed( "afschilder", stemmingExceptions, verbPrefixes ) ).toBe( false );
	} );
	it( "returns false if the second to last syllable contains a diphthong", () => {
		expect( isVowelDoublingAllowed( "klieder", stemmingExceptions, verbPrefixes ) ).toBe( false );
	} );
} );
