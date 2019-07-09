import stem from "../../../src/morphology/dutch/stem";

const wordsToStem = [
	// -heden gets replaced with -heid (suffix type a1).
	[ "mogelijkheden", "mogelijkheid" ],
	// -En suffix preceded by a valid -en ending.
	[ "vrouwen", "vrouw" ],
	// A word ending in -en not preceded by a valid -en ending.
	[ "groen", "groen" ],
	// A word ending in -en preceded by a valid -en ending, but with an R1 preceded by less than 3 characters.
	[ "den", "den" ],
	// -En suffix with a double consonant preceding it.
	[ "bakken", "bak" ],
	// Suffix -es preceded by a valid -es ending.
	[ "sandwiches", "sandwich" ],
	// -S suffix preceded by a valid -s ending.
	[ "torens", "toren" ],
	// -S not preceded by a valid -s ending.
	[ "prijs", "prijs" ],
	// -E not preceded by a valid -e ending.
	[ "missie", "missie" ],
	// A word without an R1.
	[ "zo", "zo" ],
	// A word with a vowel that should be treated like a consonant.
	[ "groeien", "groei" ],
	// A word with a double vowel
	[ "maan", "maan" ],
	// A word with a single vowel
	[ "man", "man" ],
	// Suffix -etje.
	[ "dingetje", "ding" ],
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
	// Suffix -je preceded by ch..
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
	// Suffix -st preceded by a vowel and e.
	[ "tevreest", "tevree" ],
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
	// A verb that should have the vowel doubled.
	[ "maken", "maak" ],
	// A present participle verb that should have the vowel doubled
	[ "rakend", "raak" ],
	// An adjective that should have the vowel doubled.
	[ "lager", "laag" ],
	// An adjective with stem ending in d that should have the vowel doubled.
	[ "kwader", "kwaad" ],
	// Vowel doubling + V at the end of a stem gets replaced by f.
	[ "beloven", "beloof" ],
	// Vowel doubling + Z at the end of a stem gets replaced by s.
	[ "lezen", "lees" ],
	// A word that should not have the vowel doubled
	[ "wisselen", "wissel" ],
	// A word that should have the consonant undoubled.
	[ "mannen", "man" ],
	// An adjective with stem ending in -iël.
	[ "officiële", "officieel" ],
	// An adjective with the superlative stem ending in -ïed
	[ "paranoïedste", "paranoïd" ],
	// An adjective with the comparative partitive suffix -ers
	[ "kleiners", "klein" ],
];

describe( "Test for stemming Dutch words", () => {
	it( "stems Dutch nouns", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
