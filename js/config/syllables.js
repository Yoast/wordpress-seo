/** @module config/syllables */

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
module.exports = function() {
	return {
		syllables: {
			subtractSyllables: {
				syllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
				multiplier: -1
			},
			addSyllables: {
				syllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]le$", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$"],
				multiplier: +1
			}
		},
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 },
			{ word: "business", syllables: 2 },
			{ word: "heiress", syllables: 2 },
			{ word: "coheiress", syllables: 3 },
			{ word: "unheired", syllables: 2 },
			// The abbreviation i.e. should be counted as 2 syllables.
			{ word: "i e", syllables: 2}
		],
		vowels: 'aeiouy'
	};
};

