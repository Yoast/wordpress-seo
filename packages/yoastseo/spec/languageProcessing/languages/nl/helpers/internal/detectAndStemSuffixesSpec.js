import detectAndStemSuffixes from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/detectAndStemSuffixes";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

const wordsToStem = [
	// -heden gets replaced with -heid (suffix type a1).
	[ "mogelijkheden", "mogelijkheid" ],
	// -En suffix preceded by a valid -en ending.
	[ "vrouwen", "vrouw" ],
	// An adjective with the superlative stem ending in -ïed
	[ "paranoïedste", "paranoïd" ],
	// A verb that should have the vowel doubled.
	[ "maken", "maak" ],
	// // -En suffix with a double consonant preceding it.
	[ "bakken", "bak" ],
	// Suffix -es preceded by a valid -es ending.
	[ "sandwiches", "sandwich" ],
	// -S suffix preceded by a valid -s ending.
	[ "torens", "toren" ],
	// A word with a vowel that should be treated like a consonant.
	[ "groeien", "groei" ],
	// Suffix -etje preceded by -ing.
	[ "dingetje", "ding" ],
	// Suffix -etje preceded by double consonant.
	[ "bolletje", "bol" ],
	// Suffix -tje preceded by an apostrophe.
	[ "baby'tje", "baby" ],
	// Suffix -tje preceded by w.
	[ "vrouwtje", "vrouw" ],
	// Suffix -tje preceded by -ector.
	[ "rectortje", "rector" ],
	// Suffix -tje preceded by -ator.
	[ "alligatortje", "alligator" ],
	// Suffix -pje preceded by lm.
	[ "filmpje", "film" ],
	// Suffix -pje preceded by uum.
	[ "kostuumpje", "kostuum" ],
	// Suffix -je preceded by a valid -je ending.
	[ "kindje", "kind" ],
	// Suffix -je preceded by k.
	[ "kettinkje", "ketting" ],
	// Suffix -je preceded by ch.
	[ "kuchje", "kuch" ],
	// Suffix -jes.
	[ "schaapjes", "schaap" ],
	// Suffix -s preceded by an apostrophe.
	[ "firma's", "firma" ],
	// Suffix -ën preceded by a valid -ën ending.
	[ "allergieën", "allergie" ],
	// Suffix -en preceded by a vowel + i.
	[ "aardbeien", "aardbei" ],
	// Suffix -der.
	[ "lekkerder", "lekker" ],
	// Suffix -ere preceded by a valid -ere ending.
	[ "warmere", "warm" ],
	// Suffix -ere preceded by d.
	[ "koudere", "koud" ],
	// Suffix -er preceded by -eerd.
	[ "geconcentreerder", "geconcentreerd" ],
	// Suffix -ër preceded by a valid -ër ending.
	[ "tevreeër", "tevree" ],
	// Suffix -st preceded by a valid -st ending.
	[ "warmst", "warm" ],
	// Suffix -est.
	[ "mooiest", "mooi" ],
	// Suffix -er preceded by a vowel and i.
	[ "mooier", "mooi" ],
	// Suffix -end preceded by a consonant.
	[ "werkende", "werk" ],
	// Suffix -end followed by suffix -er.
	[ "afwisselender", "afwissel" ],
	// Suffix -e preceded by a valid -e ending.
	[ "kleine", "klein" ],
	// Suffix -ë preceded by a valid -ë ending.
	[ "gedweeë", "gedwee" ],
	// A present participle verb that should have the vowel doubled
	[ "rakend", "raak" ],
	// An adjective that should have the vowel doubled.
	[ "lager", "laag" ],
	// An adjective with stem ending in d that should have the vowel doubled.
	[ "luider", "luid" ],
	// Vowel doubling + V at the end of a stem gets replaced by f.
	[ "zweven", "zweef" ],
	// Vowel doubling + Z at the end of a stem gets replaced by s.
	[ "lezen", "lees" ],
	// A word that should not have the vowel doubled because the vowel is preceded by two same consonants.
	[ "wisselen", "wissel" ],
	// A word that should not have the vowel doubled because it is on an exception list.
	[ "motoren", "motor" ],
	// A word that should not have the vowel doubled because the preceding syllable contains a diphthong.
	[ "duivelen", "duivel" ],
	// A word that should have the consonant undoubled.
	[ "mannen", "man" ],
	// An adjective with stem ending in -iël.
	[ "officiële", "officieel" ],
	// An adjective with the superlative stem ending in -ïed.
	[ "paranoïedste", "paranoïd" ],
	// An adjective with the comparative partitive suffix -ers.
	[ "ronders", "rond" ],
];

// These words should not be stemmed (same form should be returned).

const wordsNotToStem = [
	// A word ending in -en not preceded by a valid -en ending.
	"groen",
	// A word ending in -en preceded by a valid -en ending, but with an R1 preceded by less than 3 characters.
	"den",
	// -S not preceded by a valid -s ending.
	"prijs",
	// -E not preceded by a valid -e ending.
	"missie",
	// A word without an R1.
	"zo",
	// A word with a single vowel. Only stems which had one of the specified suffixes should have the vowel doubled.
	"man",
];

describe( "Test for stemming Dutch words", () => {
	it( "stems Dutch nouns", () => {
		wordsToStem.forEach( wordToStem => expect( detectAndStemSuffixes( wordToStem[ 0 ], morphologyDataNL ) ).toBe( wordToStem[ 1 ] ) );
		wordsNotToStem.forEach( wordNotToStem => expect( detectAndStemSuffixes( wordNotToStem, morphologyDataNL ) ).toBe( wordNotToStem ) );
	} );
} );
