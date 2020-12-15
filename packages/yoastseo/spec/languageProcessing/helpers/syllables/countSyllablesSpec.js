import countSyllables from "../../../../src/languageProcessing/helpers/syllables/countSyllables";

const syllablesTestDataWithoutDeviations = {
	vowels: "aoeiuy",
};

const syllablesTestDataWithoutWordDeviations = {
	vowels: "aoeiuy",
	deviations: {
		vowels: [
			{
				fragments: [ "ie" ],
				countModifier: -1,
			},
		],
	},
};

const syllablesTestDataWithoutFullWordDeviations = {
	vowels: "aoeiuy",
	deviations: {
		vowels: [
			{
				fragments: [ "ie" ],
				countModifier: -1,
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
				fragments: [ "cial" ],
				countModifier: -1,
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
/*	it( "counts syllables when the syllables object contains no deviations", function() {
		expect( countSyllables( "two cats", syllablesTestDataWithoutDeviations ) ).toBe( 2 );
	} );
	it( "counts syllables in words for which the number of syllables is specified (full word deviations)", function() {
		expect( countSyllables( "ok ok", syllablesTestDataWithoutFragmentWordDeviations ) ).toBe( 4 );
	} );
	it( "counts syllables in words containing a fragment for which the number of syllables is specified" +
		" (fragments word deviations)", function() {
		expect( countSyllables( "unclosed", syllablesTestDataWithoutFullWordDeviations ) ).toBe( 2 );
		expect( countSyllables( "ducttapes", syllablesTestDataWithoutFullWordDeviations ) ).toBe( 2 );
	} );*/
	it( "counts syllables when the syllable object contains no word deviations", function() {
		expect( countSyllables( "pie", syllablesTestDataWithoutWordDeviations ) ).toBe( 1 );
	} );
	/*it( "counts syllables when the syllable object contains no fragment word deviations", function() {
		expect( countSyllables( "cat", syllablesTestDataWithoutFragmentWordDeviations ) ).toBe( 1 );
	} );*/
} );
