import countSyllables from "../../../../src/languageProcessing/helpers/syllables/countSyllables";

import { forEach } from "lodash-es";

const syllablesTestData = {
	vowels: "aoeiuyé",
	deviations: {
		vowels: [
			{
				fragments: [ "cial", "[aeiouy][^aeiuoyts]{1,}e$", "eau", "ieu" ],
				countModifier: -1,
			},
			{
				fragments: [ "ment", "coe[^u]" ],
				countModifier: 1,
			},
		],
	},
	words: {
		full: [
			{
				word: "ok",
				syllables: 2,
			},
			{
				word: "incompétent",
				syllables: 4,
			},
		],
	},
};

/**
 * Helper to test syllable count.
 *
 * @param {array}  testCases List of cases to test.
 * @param {Object} syllables The object with syllables data.
 * @returns {void}
 */
function testCountSyllables( testCases, syllables ) {
	forEach( testCases, function( expected, input ) {
		const actual = countSyllables( input, syllables );

		expect( actual ).toBe( expected );
	} );
}

