import stem from "../../../src/morphology/french/stem";


const wordsToStem = [
	// RV is the region after the third letter if the word begins with two vowels.
	[ "aimer", "aim" ],
	// RV is the region after the first vowel not at the beginning of the word.
	[ "adorer", "ador" ],
	// RV is the end of the word if the previous positions cannot be found.
	[ "voler", "vol" ],
	// RV is the right of par, col, tap for words beginning with those syllables.
	[ "tapis", "tapis" ],
	// Input a word ending in ci + a2 class suffix.
	[ "cicatrice", "cicatric" ],
	// Input a noun ending in -ance.
	[ "concordances", "concord" ],
	[ "concordance", "concord" ],
	// Input a noun ending in -ique.
	[ "botaniques", "botan" ],
	[ "botanique", "botan" ],
	// Input a noun ending in -isme.
	[ "dualismes", "dualism" ],
	[ "dualisme", "dualism" ],
	// Input a noun ending in -able.
	[ "confortables", "confort" ],
	[ "confortable", "confort" ],
	// Input a noun ending in -iste.
	[ "fatalistes", "fatal" ],
	[ "fataliste", "fatal" ],
	// Input a noun ending in -eux.
	[ "bileux", "bileux" ],
	// Input a noun ending in -atrice.
	[ "curatrices", "curatric" ],
	[ "curatrice", "curatric" ],
	// Input a noun ending in -eur.
	[ "acteurs", "acteur" ],
	// Input a noun ending in -logie.
	[ "analogie", "analog" ],
	[ "analogies", "analog" ],
	// Input a noun ending in -usion.
	[ "autotransfusion", "autotransfu" ],
	[ "autotransfusions", "autotransfu" ],
	// Input a noun ending in -ence.
	[ "différence", "différent" ],
	[ "différences", "différent" ],
	// Input a noun ending in -ité.
	[ "réalité", "réalit" ],
	[ "réalités", "réalit" ],
	// Input a noun ending in -if.
	[ "corrosif", "corros" ],
	[ "corrosives", "corros" ],
	// Input a noun ending in -eaux.
	[ "tableaux", "tableau" ],
	// Input a noun ending in -aux.
	[ "animaux", "animal" ],
	// Input a noun ending in -euse.
	[ "paresseuse", "paress" ],
	[ "paresseuses", "paress" ],
	// Input a noun ending in -issement.
	[ "divertissement", "divertiss" ],
	[ "divertissements", "divertiss" ],
	// Input a noun ending in -amment.
	[ "couramment", "cour" ],
	// Input a noun ending in -emment.
	[ "apparemment", "apparent" ],
	// Input a noun ending in -ment.
	[ "clément", "clément" ],
	[ "cléments", "clément" ],


];

const paradigms = [
	// A paradigm with various types of diminutive
	{ stem: "acteur", forms: [ "acteurs", "acteur" ] },
];


describe( "Test for stemming French words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ] ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
