import countSyllables from "../../../../src/languageProcessing/helpers/syllables/countSyllables";

const syllablesTestDataWithoutDeviations = {
	vowels: "aoeiuy",
};

const syllablesTestDataWithoutWordDeviations = {
	vowels: "aoeiuy",
	deviations: {
		vowels: [
			{
				fragments: [ "ia" ],
				countModifier: 1,
			},
		],
	},
};

const syllablesTestDataWithoutFullWordDeviations = {
	vowels: "aoeiuy",
	deviations: {
		vowels: [
			{
				fragments: [ "ia" ],
				countModifier: 1,
			},
		],
		words: {
			fragments: {
				global: [
					{ word: "close", syllables: 1, notFollowedBy: [ "r", "t" ] },
				],
				atEnd: [
					{ word: "tape", syllables: 1, alsoFollowedBy: [ "s" ] },
				],
			},
		},
	},
};

const syllablesTestDataWithoutFragmentWordDeviations = {
	vowels: "aoeiuy",
	deviations: {
		vowels: [
			{
				fragments: [ "ia" ],
				countModifier: 1,
			},
		],
		words: {
			full: [
				{
					word: "ok",
					syllables: 2,
				},
			],
		},
	},
};

describe( "a syllable counter for text strings", function() {
	it( "counts syllables when the syllables object has no deviations property", function() {
		expect( countSyllables( "two cats", syllablesTestDataWithoutDeviations ) ).toBe( 2 );
	} );
	it( "counts syllables for a word without deviations when the syllable object has the deviations property", function() {
		expect( countSyllables( "cat", syllablesTestDataWithoutFragmentWordDeviations ) ).toBe( 1 );
	} );
	it( "counts syllables in words for which the number of syllables is specified (full word deviations)", function() {
		expect( countSyllables( "ok ok", syllablesTestDataWithoutFragmentWordDeviations ) ).toBe( 4 );
	} );
	it( "counts syllables in words containing a fragment for which the number of syllables is specified" +
		" (fragments word deviations)", function() {
		expect( countSyllables( "unclosed", syllablesTestDataWithoutFullWordDeviations ) ).toBe( 2 );
		expect( countSyllables( "ducttapes", syllablesTestDataWithoutFullWordDeviations ) ).toBe( 2 );
	} );
	it( "counts syllables when the syllable object contains vowel deviations (and no word deviations)", function() {
		expect( countSyllables( "trial", syllablesTestDataWithoutWordDeviations ) ).toBe( 2 );
	} );
} );
