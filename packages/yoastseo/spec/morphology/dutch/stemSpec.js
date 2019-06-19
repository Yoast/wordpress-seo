import stem from "../../../src/morphology/dutch/stem";

const wordsToStem = [
	// -heden gets replaced with -heid (suffix type a1).
	[ "mogelijkheden", "mogelijkheid" ],
	// -En suffix preceded by a valid -en ending (suffix type b1).
	[ "vrouwen", "vrouw" ],
	// A word ending in -en not preceded by a valid -en ending.
	[ "groen", "groen" ],
	// A word ending in -en preceded by a valid -en ending, but with an R1 preceded by less than 3 characters.
	[ "den", "den" ],
	// -En suffix with a double consonant preceding it (suffix type b1).
	[ "bakken", "bak" ],
	// -S suffix preceded by a valid -s ending (suffix type f1).
	[ "torens", "toren" ],
	// -S not preceded by a valid -s ending.
	[ "prijs", "prijs" ],
	// -E not preceded by a valid -e ending.
	[ "missie", "missie" ],
	// A word without an R1.
	[ "zo", "zo" ],
	// A word with a vowel that should be treated like a consonant.
	[ "groeien", "groei" ],
	// A word that needs to have the vowel undoubled.
	[ "maan", "man" ],
	// Suffix -etje (suffix type a2).
	[ "dingetje", "ding" ],
	// Suffix -tje preceded by an apostrophe (suffix type b2).
	[ "baby'tje", "baby" ],
	// Suffix -tje preceded by w (suffix type c2).
	[ "vrouwtje", "vrouw" ],
	// Suffix -tje preceded by -ector (suffix type d2).
	[ "rectortje", "rector" ],
	// Suffix -tje preceded by -ator (suffix type e2).
	[ "alligatortje", "alligator" ],
	// Suffix -pje preceded by lm (suffix type f2).
	[ "filmpje", "film" ],
	// Suffix -pje preceded by uum (suffix type g2).
	[ "kostuumpje", "kostum" ],
	// Suffix -je preceded by a valid -je ending (suffix type h2)
	[ "kindje", "kind" ],
	// Suffix -je preceded by k (suffix type h2)
	[ "kettinkje", "ketting" ],
	// Suffix -je preceded by ch (suffix type i2).
	[ "kuchje", "kuch" ],
	// Suffix -jes (suffix type e1).
	[ "schaapjes", "schap" ],
	// Suffix -s preceded by an apostrophe.
	[ "firma's", "firma" ],
	// Suffix -ën preceded by a valid -ën ending (suffix type d1).
	[ "allergieën", "allergie" ],
	// Suffix -en preceded by a vowel + i (suffix type c1).
	[ "aardbeien", "aardbei" ],
	// Suffix -der (suffix type h1).
	[ "lekkerder", "lekker" ],
	// Suffix -ere preceded by a valid -ere ending (suffix type i1).
	[ "warmere", "warm" ],
	// Suffix -ere preceded by d (suffix type k1).
	[ "koudere", "koud" ],
	// Suffix -er preceded by -eerd (suffix type g1).
	[ "geconcentreerder", "geconcentreerd" ],
	// Suffix -ër preceded by a valid -ër ending (suffix type l1).
	[ "tevreeër", "tevree" ],
	// Suffix -st preceded by a valid -st ending (suffix type m1).
	[ "warmst", "warm" ],
	// Suffix -st preceded by a vowel and e (suffix type o1).
	[ "tevreest", "tevree" ],
	// Suffix -est (suffix type p1).
	[ "mooiest", "mooi" ],
	// Suffix -er preceded by a vowel and i (suffix type q1).
	[ "mooier", "mooi" ],
	// Suffix -end preceded by a consonant (suffix type a3) .
	[ "werkende", "werk" ],
	// Suffix -end preceded by a consonant and i (suffix type b3) .
	[ "werkende", "werk" ],
	// Suffix -end followed by suffix -er (suffix type a3 + suffix type k1).
	[ "afwisselender", "afwissel" ],
	// Suffix -e preceded by a valid -e ending (suffix type c3).
	[ "kleine", "klein" ],
	// Suffix -ë preceded by a valid -ë ending (suffix type d3).
	[ "gedweeë", "gedwee" ],
];

describe( "Test for stemming Dutch words", () => {
	it( "stems Dutch nouns", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
