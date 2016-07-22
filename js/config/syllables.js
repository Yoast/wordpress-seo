/** @module config/syllables */

var getLanguage = require( "../helpers/getLanguage.js" );
var isUndefined = require( "lodash/isUndefined" );

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
var syllableLanguageConfig = {
	en: {
		syllableExclusion: {
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
			{ word: "i.e", syllables: 2}
		],
		vowels: 'aeiouy'
	},
	nl: {
		syllableExclusion: {
			subtractSyllables: {
				syllables: [ "ue+$", "ue$", "dge+$", "dge$","[tcp]iënt" ,"ace$", "ace+$", "[br]each", "[ainpr]tiaal", "[io]tiaan", "gua[yc]", "[^i]deal", "^deal", "tive$", "base[^enr]", "base$", "load", "close[^rt]", "close$", "[^e]coke", "^coke", "drive[^r]", "drive$", "[^s]core$", "^core$", "face[^nt]", "face$", "cache[^clntx]", "cache$", "game[^nlr]", "game$" ],
				multiplier: -1
			},
			addSyllables: {
				syllables: [ "aä", "aeu", "aie", "ao", "ë", "eo", "eú", "ieau", "ea$", "ea+$", "ea[^u]", "ei[ej]", "eu[iu]", "ï", "iei", "ienne", "[^l]ieu[^w]", "[^l]ieu$", "[^l]ieu+$",  "i[auiy]", "stion", "[^cstx]io", "^sion","riè", "oö", "oa", "oeing", "oeyo", "oie", "[eu]ü", "[^q]u[oaeè]", "uie", "[aeolu]y[eéèaoóu]", "[bhnpr]ieel", "[bhnpr]iël" ],
				multiplier: +1
			}
		},
		exclusionWords: [
			{ word: "bye", syllables: 1 },
			{ word: "cure", syllables: 1 },
			{ word: "dei", syllables: 2 },
			{ word: "dope", syllables: 1 },
			{ word: "dude", syllables: 1 },
			{ word: "fame", syllables: 1 },
			{ word: "five", syllables: 1 },
			{ word: "hole", syllables: 1 },
			{ word: "least", syllables: 1 },
			{ word: "minute", syllables: 2 },
			{ word: "move", syllables: 1 },
			{ word: "nice", syllables: 1 },
			{ word: "one", syllables: 1 },
			{ word: "state", syllables: 1 },
			{ word: "wide", syllables: 1 },
			{ word: "lone", syllables: 1 },
			{ word: "surplace", syllables: 2 },
			{ word: "fake", syllables: 1 },
			{ word: "take", syllables: 1 },
			{ word: "intake", syllables: 1 },
			{ word: "trade", syllables: 1 }
		],
		partlyExclusionWords: {
			compounds: {
				exclusionParts: [
					{ word: "byte", syllables: 1 },
					{ word: "cake", syllables: 1 },
					{ word: "care", syllables: 1 },
					{ word: "coach", syllables: 1 },
					{ word: "coat", syllables: 1 },
					{ word: "gate", syllables: 1 },
					{ word: "earl", syllables: 1 },
					{ word: "foam", syllables: 1 },
					{ word: "head", syllables: 1 },
					{ word: "home", syllables: 1 },
					{ word: "live", syllables: 1 },
					{ word: "safe", syllables: 1 },
					{ word: "site", syllables: 1 },
					{ word: "soap", syllables: 1 },
					{ word: "teak", syllables: 1 },
					{ word: "team", syllables: 1 },
					{ word: "wave", syllables: 1 }
				],
				regexPrefix: "^",
				regexSuffix: "$"
			},
			compoundEnds: {
				exclusionParts: [
					{ word: "tea", syllables: 1 },
					{ word: "time", syllables: 1 },
					{ word: "force", syllables: 1 }
				],
				regexSuffix: "$",
				regexPrefix: ""
			}
		},
		vowels: 'aáäâeéëêiíïîoóöôuúüûy'
	}
};

module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		locale = "en_US"
	}
	switch( getLanguage( locale ) ) {
		case "nl":
			return syllableLanguageConfig.nl;
		case "en":
		default:
			return syllableLanguageConfig.en;
	}
};
