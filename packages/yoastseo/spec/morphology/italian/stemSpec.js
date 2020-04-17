import stem from "../../../src/morphology/italian/stem";

const wordsToStem = [
	// Input a plural noun.
	[ "cani", "can" ],
	// Input a singular noun.
	[ "cane", "can" ],
	// Input a short singular noun with stem structure VCC.
	// [ "asso", "ass" ],
	// Input a superlative.
	// [ "bellissimo", "bell" ],
	// Input a diminutive.
	// [ "casina", "cas" ],
	// Input a short feminine adjective.
	[ "cara", "car" ],
	// Input a short masculine adjective.
	[ "caro", "car" ],
	// Input an adverb.
	// Input a feminine adjective.
	[ "carina", "carin" ],
	// Input a masculine adjective.
	[ "carino", "carin" ],
	// Input an adverb.
	[ "lentamente", "lent" ],
];

const paradigms = [
	// A verb paradigm in are.
	{
		stem: "impar",
		forms: [
			"imparo",
			"imparano",
			"imparavo",
			"imparavi",
			"imparava",
			"imparavamo",
			"imparavate",
			"imparavano",
			"imparai",
			// "imparasti",
			"imparò",
			"imparammo",
			"impararono",
			"imparerò",
			"imparerai",
			"imparerà",
			"impareremo",
			"imparerete",
			"impareranno",
			"imparerei",
			"impareresti",
			"imparerebbe",
			"impareremmo",
			"imparereste",
			"imparerebbero",
			"impariate",
			"imparassi",
			"imparasse",
			"imparassimo",
			// "imparaste",
			"imparassero",
			"impara",
			"impari",
			"impariamo",
			"imparate",
			// "imparino",
			"imparare",
			"imparante",
			"imparato",
			"imparando"
		],
	},
	// A verb paradigm in ere.
	{
		stem: "corr",
		forms: [
			"corro",
			"corre",
			"corrono",
			"correvo",
			"correvi",
			"correva",
			"correvamo",
			"correvate",
			"correvano",
			// "corsi",
			// "corresti",
			// "corse",
			"corremmo",
			// "corsero",
			"correrò",
			"correrai",
			"correrà",
			"correremo",
			"correrete",
			"correranno",
			"correrei",
			"correresti",
			"correrebbe",
			"correremmo",
			"correreste",
			"correrebbero",
			"corriate",
			// "corressi",
			// "corresse",
			// "corressimo",
			// "correste",
			"corressero",
			"corri",
			"corra",
			"corriamo",
			"correte",
			"corrano",
			"correre",
			// "corrente",
			// "corso",
			"correndo",
		],
	},
	// A verb paradigm in ire.
	{
		stem: "dorm",
		forms: [
			"dormi",
			"dormo",
			"dorme",
			"dormiamo",
			"dormite",
			"dormono",
			"dormivo",
			"dormivi",
			"dormiva",
			"dormivamo",
			"dormivate",
			"dormivano",
			"dormii",
			// "dormisti",
			"dormì",
			"dormimmo",
			// "dormiste",
			"dormirono",
			"dormirò",
			"dormirai",
			"dormirà",
			"dormiremo",
			"dormirete",
			"dormiranno",
			"dormirei",
			"dormiresti",
			"dormirebbe",
			"dormiremmo",
			"dormireste",
			"dormirebbero",
			"dorma",
			"dorma",
			"dorma",
			"dormiamo",
			"dormiate",
			"dormano",
			// "dormissi",
			// "dormisse",
			// "dormissimo",
			// "dormiste",
			"dormissero",
			"dormi",
			"dorma",
			"dormiamo",
			"dormite",
			"dormano",
			"dormire",
			// "dormente",
			// "dormiente",
			"dormito",
			"dormendo",
		],
	},
];


describe( "Test for stemming Italian words", () => {
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
