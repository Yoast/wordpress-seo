module.exports = {
	vowels: "aeiouy",
	deviations: {
		vowels: [
			{
				fragments: [ "cial", "tia", "cius", "cious", "giu", "ion",
					"iou", "sia$", "[^aeiuoyt]{2,}ed$",
					"[aeiouy][^aeiuoyts]{1,}e$", ".ely$", "[cg]h?e[sd]",
					"rved$", "rved", "[aeiouy][dt]es?$",
					"[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$",
					"[aeiouy]rse$" ],
				countModifier: -1
			},
			{
				fragments: [ "ia", "riet", "dien", "iu", "io", "ii",
					"[aeiouym][bdp]le$", "[aeiou]{3}", "^mc", "ism$",
					"([^aeiouy])\\1l$", "[^l]lien", "^coa[dglx].",
					"[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)",
					"[aeiouy]ing", "[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$" ],
				countModifier: +1
			}
		],
		words: {
			full: [
				{ word: "business", syllables: 2 },
				{ word: "coheiress", syllables: 3 },
				{ word: "colonel", syllables: 2 },
				{ word: "heiress", syllables: 2 },
				// The abbreviation i.e. should be counted as 2 syllables.
				{ word: "i.e", syllables: 2 },
				{ word: "shoreline", syllables: 2 },
				{ word: "simile", syllables: 3 },
				{ word: "unheired", syllables: 2 },
				{ word: "wednesday", syllables: 2 }
			]
		}
	}
};
