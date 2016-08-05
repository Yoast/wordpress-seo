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
			{ word: "business", syllables: 2 },
			{ word: "coheiress", syllables: 3 },
			{ word: "colonel", syllables: 2 },
			{ word: "heiress", syllables: 2 },
			// The abbreviation i.e. should be counted as 2 syllables.
			{ word: "i.e", syllables: 2},
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 },
			{ word: "unheired", syllables: 2 },
			{ word: "wednesday", syllables: 2 }
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
		// Exclusion words that are loan-words from English.
		exclusionWords: [
			{ word: "bye", syllables: 1 },
			{ word: "cure", syllables: 1 },
			{ word: "dei", syllables: 2 },
			{ word: "dope", syllables: 1 },
			{ word: "dude", syllables: 1 },
			{ word: "fake", syllables: 1 },
			{ word: "fame", syllables: 1 },
			{ word: "five", syllables: 1 },
			{ word: "hole", syllables: 1 },
			{ word: "least", syllables: 1 },
			{ word: "lone", syllables: 1 },
			{ word: "minute", syllables: 2 },
			{ word: "move", syllables: 1 },
			{ word: "nice", syllables: 1 },
			{ word: "one", syllables: 1 },
			{ word: "state", syllables: 1 },
			{ word: "surplace", syllables: 2 },
			{ word: "take", syllables: 1 },
			{ word: "trade", syllables: 1 },
			{ word: "wide", syllables: 1 }
		],
		partialExclusionWords: {
			// Exclusions that should be found anywhere in a string. Mostly loan-words from English and French.
			wordParts: {
				exclusionParts: [
					{ word: "adieu", syllables: 2 },
					{ word: "airline", syllables: 2 },
					{ word: "airmiles", syllables: 2 },
					{ word: "alien", syllables: 3 },
					{ word: "ambient", syllables: 3 },
					{ word: "announcement", syllables: 3 },
					{ word: "appearance", syllables: 3 },
					{ word: "appeasement", syllables: 3 },
					{ word: "atheneum", syllables: 4 },
					{ word: "awesome", syllables: 2 },
					{ word: "baccalaurei", syllables: 5 },
					{ word: "baccalaureus", syllables: 5 },
					{ word: "baseball", syllables: 3 },
					{ word: "basejump", syllables: 2 },
					{ word: "banlieue", syllables: 3 },
					{ word: "bapao", syllables: 2 },
					{ word: "barbecue", syllables: 3},
					{ word: "beamer", syllables: 2 },
					{ word: "beanie", syllables: 2 },
					{ word: "beat", syllables: 1 },
					{ word: "belle", syllables: 2 },
					{ word: "bête", syllables: 1 },
					{ word: "bingewatch", syllables: 2 },
					{ word: "blocnote", syllables: 2 },
					{ word: "blue", syllables: 1 },
					{ word: "board", syllables: 1 },
					{ word: "break", syllables: 1 },
					{ word: "broad", syllables: 1 },
					{ word: "bulls-eye", syllables: 2 },
					{ word: "business", syllables: 2 },
					{ word: "byebye", syllables: 2 },
					{ word: "cacao", syllables: 2 },
					{ word: "caesar", syllables: 2 },
					{ word: "camaieu", syllables: 3 },
					{ word: "caoutchouc", syllables: 2 },
					{ word: "carbolineum", syllables: 5 },
					{ word: "catchphrase", syllables: 1 },
					{ word: "carrier", syllables: 3 },
					{ word: "cheat", syllables: 1 },
					{ word: "cheese", syllables: 1 },
					{ word: "circonflexe", syllables: 3 },
					{ word: "clean", syllables: 1 },
					{ word: "cloak", syllables: 1 },
					{ word: "cobuying", syllables: 3 },
					{ word: "comeback", syllables: 2 },
					{ word: "comfortzone", syllables: 3 },
					{ word: "communiqué", syllables: 4 },
					{ word: "conopeum", syllables: 4 },
					{ word: "console", syllables: 2 },
					{ word: "corporate", syllables: 3 },
					{ word: "coûte", syllables: 1 },
					{ word: "creamer", syllables: 2 },
					{ word: "crime", syllables: 1 },
					{ word: "cruesli", syllables: 2 },
					{ word: "deadline", syllables: 2 },
					{ word: "deautoriseren", syllables: 6 },
					{ word: "deuce", syllables: 1 },
					{ word: "deum", syllables: 2 },
					{ word: "dirndl", syllables: 2 },
					{ word: "dread", syllables: 2 },
					{ word: "dreamteam", syllables: 2 },
					{ word: "drone", syllables: 1 },
					{ word: "enquête", syllables: 3 },
					{ word: "escape", syllables: 2 },
					{ word: "exposure", syllables: 3 },
					{ word: "extranei", syllables: 4 },
					{ word: "extraneus", syllables: 4 },
					{ word: "eyecatcher", syllables: 3 },
					{ word: "eyeliner", syllables: 3 },
					{ word: "eyeopener", syllables: 4 },
					{ word: "eyetracker", syllables: 3 },
					{ word: "eyetracking", syllables: 3 },
					{ word: "fairtrade", syllables: 2 },
					{ word: "fauteuil", syllables: 2 },
					{ word: "feature", syllables: 2 },
					{ word: "feuilletee", syllables: 3 },
					{ word: "feuilleton", syllables: 3 },
					{ word: "fisheye", syllables: 2 },
					{ word: "fineliner", syllables: 3 },
					{ word: "finetunen", syllables: 3 },
					{ word: "forehand", syllables: 2 },
					{ word: "freak", syllables: 1 },
					{ word: "fusioneren", syllables: 4 },
					{ word: "gayparade", syllables: 3 },
					{ word: "gaypride", syllables: 2 },
					{ word: "goal", syllables: 1 },
					{ word: "grapefruit", syllables: 2 },
					{ word: "gruyère", syllables: 3 },
					{ word: "guele", syllables: 1 },
					{ word: "guerrilla", syllables: 3 },
					{ word: "guest", syllables: 1 },
					{ word: "hardware", syllables: 2 },
					{ word: "haute", syllables: 1 },
					{ word: "healing", syllables: 2 },
					{ word: "heater", syllables: 2 },
					{ word: "heavy", syllables: 2 },
					{ word: "hoax", syllables: 1 },
					{ word: "hotline", syllables: 2 },
					{ word: "idee-fixe", syllables: 3 },
					{ word: "inclusive", syllables: 3 },
					{ word: "inline", syllables: 2 },
					{ word: "intake", syllables: 2 },
					{ word: "intensive", syllables: 3 },
					{ word: "jeans", syllables: 1 },
					{ word: "Jones", syllables: 1},
					{ word: "jubileum", syllables: 4 },
					{ word: "kalfsribeye", syllables: 3 },
					{ word: "kraaiennest", syllables: 3 },
					{ word: "lastminute", syllables: 3 },
					{ word: "learning", syllables: 2 },
					{ word: "league", syllables: 1 },
					{ word: "line-up", syllables: 2 },
					{ word: "linoleum", syllables: 4 },
					{ word: "load", syllables: 1 },
					{ word: "loafer", syllables: 2 },
					{ word: "longread", syllables: 2 },
					{ word: "lookalike", syllables: 3 },
					{ word: "louis", syllables: 3 },
					{ word: "lyceum", syllables: 3 },
					{ word: "magazine", syllables: 3 },
					{ word: "mainstream", syllables: 2 },
					{ word: "make-over", syllables: 3 },
					{ word: "make-up", syllables: 2 },
					{ word: "malware", syllables: 2 },
					{ word: "marmoleum", syllables: 4 },
					{ word: "mausoleum", syllables: 4 },
					{ word: "medeauteur", syllables: 4 },
					{ word: "midlifecrisis", syllables: 4 },
					{ word: "migraineaura", syllables: 5 },
					{ word: "milkshake", syllables: 2 },
					{ word: "millefeuille", syllables: 4 },
					{ word: "mixed", syllables: 1 },
					{ word: "muesli", syllables: 2 },
					{ word: "museum", syllables: 3 },
					{ word: "must-have", syllables: 2 },
					{ word: "must-read", syllables: 2 },
					{ word: "notebook", syllables: 2 },
					{ word: "nonsense", syllables: 2 },
					{ word: "nowhere", syllables: 2 },
					{ word: "nurture", syllables: 2 },
					{ word: "offline", syllables: 2 },
					{ word: "oneliner", syllables: 3 },
					{ word: "onesie", syllables: 2 },
					{ word: "online", syllables: 2 },
					{ word: "opinion", syllables: 3 },
					{ word: "paella", syllables: 3 },
					{ word: "pacemaker", syllables: 3 },
					{ word: "panache", syllables: 2 },
					{ word: "papegaaienneus", syllables: 5},
					{ word: "passe-partout", syllables: 3 },
					{ word: "peanuts", syllables: 2 },
					{ word: "perigeum", syllables: 4 },
					{ word: "perineum", syllables: 4 },
					{ word: "perpetuum", syllables: 4 },
					{ word: "petroleum", syllables: 4 },
					{ word: "phone", syllables: 3 },
					{ word: "picture", syllables: 2 },
					{ word: "placemat", syllables: 2 },
					{ word: "porte-manteau", syllables: 3 },
					{ word: "portefeuille", syllables: 4 },
					{ word: "presse-papier", syllables: 3 },
					{ word: "primetime", syllables: 2 },
					{ word: "queen", syllables: 1 },
					{ word: "questionnaire", syllables: 3 },
					{ word: "queue", syllables: 1 },
					{ word: "reader", syllables: 2 },
					{ word: "reality", syllables: 3 },
					{ word: "reallife", syllables: 2 },
					{ word: "remake", syllables: 2 },
					{ word: "repeat", syllables: 2 },
					{ word: "repertoire", syllables: 3 },
					{ word: "research", syllables: 2 },
					{ word: "reverence", syllables: 3 },
					{ word: "ribeye", syllables: 2 },
					{ word: "ringtone", syllables: 3 },
					{ word: "road", syllables: 1 },
					{ word: "roaming", syllables: 2 },
					{ word: "sciencefiction", syllables: 4 },
					{ word: "selfmade", syllables: 2 },
					{ word: "sidekick", syllables: 2 },
					{ word: "sightseeing", syllables: 3 },
					{ word: "skyline", syllables: 2 },
					{ word: "smile", syllables: 1 },
					{ word: "sneaky", syllables: 2 },
					{ word: "software", syllables: 2 },
					{ word: "sparerib", syllables: 2 },
					{ word: "speaker", syllables: 2 },
					{ word: "spread", syllables: 1 },
					{ word: "statement", syllables: 2 },
					{ word: "steak", syllables: 1 },
					{ word: "steeplechase", syllables: 3 },
					{ word: "stonewash", syllables: 2 },
					{ word: "store", syllables: 1 },
					{ word: "streaken", syllables: 2 },
					{ word: "stream", syllables: 1 },
					{ word: "streetware", syllables: 1 },
					{ word: "supersoaker", syllables: 4 },
					{ word: "surprise-party", syllables: 4 },
					{ word: "sweater", syllables: 2 },
					{ word: "teaser", syllables: 2 },
					{ word: "tenue", syllables: 2 },
					{ word: "template", syllables: 2 },
					{ word: "timeline", syllables: 2 },
					{ word: "tissue", syllables: 2 },
					{ word: "toast", syllables: 1 },
					{ word: "tête-à-tête", syllables: 3 },
					{ word: "typecast", syllables: 2 },
					{ word: "unique", syllables: 2 },
					{ word: "ureum", syllables: 3 },
					{ word: "vibe", syllables: 1 },
					{ word: "vieux", syllables: 1 },
					{ word: "ville", syllables: 1 },
					{ word: "vintage", syllables: 2 },
					{ word: "wandelyup", syllables: 3 },
					{ word: "wiseguy", syllables: 2 },
					{ word: "wake-up-call", syllables: 3 },
					{ word: "webcare", syllables: 2 },
					{ word: "winegum", syllables: 2 }
				]
			},
			// Word compounds that should only be found at the end.
			compoundEnds: {
				exclusionParts: [
					{ word: "force", syllables: 1 },
					{ word: "tea", syllables: 1 },
					{ word: "time", syllables: 1 }
				],
				matchEnd: true
			},
			// Exclusion words that should be found at the beginning or end of a string.
			exclusionCompounds: {
				exclusionParts: [
					{ word: "byte", syllables: 1 },
					{ word: "cake", syllables: 1 },
					{ word: "care", syllables: 1 },
					{ word: "coach", syllables: 1 },
					{ word: "coat", syllables: 1 },
					{ word: "earl", syllables: 1 },
					{ word: "foam", syllables: 1 },
					{ word: "gate", syllables: 1 },
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
				matchBeginning: true,
				matchEnd: true
			},
			// Exclusion words that should be found at the end of the string, including their plurals.
			exclusionsEndPlural: {
				exclusionParts: [
					{ word: "date", syllables: 1 },
					{ word: "hype", syllables: 1 },
					{ word: "quote", syllables: 1 },
					{ word: "tape", syllables: 1 },
					{ word: "upgrade", syllables: 2 }
				],
				matchEnd: true,
				regexEndLetters: [ "", "s" ]
			},
			// Exclusion words that should be found at the begin or end of the string, but not if followed by an 's'.
			exclusionsBeginEndNoS: {
				exclusionParts: [
					{ word: "brace", syllables: 1 },
					{ word: "case", syllables: 1 },
					{ word: "fleece", syllables: 1 },
					{ word: "service", syllables: 2 },
					{ word: "voice", syllables: 1 }

				],
				matchBeginning: true,
				regexBeginLetters: [ "[^s]" ],
				matchEnd: true,
				regexEndLetters: [ "", "[^s]" ]
			},

			// Exclusion words that should be at the beginning of a string, but not if followed by an 's'.
			exclusionsBeginNoS: {
				exclusionParts: [
					{ word: "image", syllables: 2 }
				],
				matchBeginning: true,
				regexBeginLetters: [ "(?![s])" ]
			},

			// Exclusion words that should be found anywhere in a string, but not if followed by an 'n'.
			exclusionsBeginNoN: {
				exclusionParts: [
					{ word: "style", syllables: 1 }
				],
				regexAnywhereLetters: [ "(?![n])" ]
			},
			// Exclusion words that should be found anywhere in a string, but not if followed by an 'n' or 's'.
			exclusionsNoNS: {
				exclusionParts: [
					{ word: "douche", syllables: 1 },
					{ word: "space", syllables: 1 },
					{ word: "striptease", syllables: 2 }
				],
				regexAnywhereLetters: [ "(?![ns])" ]
			},
			// Exclusion words that should be found anywhere in a string, but not if followed by an 'r' or 's'.
			exclusionsNoRS: {
				exclusionParts: [
					{ word: "office", syllables: 2 }
				],
				regexAnywhereLetters: [ "(?![rs])" ]
			},
			// Exclusion words that should be found anywhere in a string, but not if followed by an 'n' or 'r'.
			exclusionsNoNR: {
				exclusionParts: [
					{ word: "jive", syllables: 1 },
					{ word: "keynote", syllables: 2 },
					{ word: "mountainbike", syllables: 3 }
				],
				regexAnywhereLetters: [ "(?![nr])" ]
			},
			// Exclusion words that should be found anywhere in a string, but not if followed by an 'n', 'r' or 's'.
			exclusionsNoNRS: {
				exclusionParts: [
					{ word: "challenge", syllables: 2 },
					{ word: "cruise", syllables: 1 },
					{ word: "house", syllables: 1 },
					{ word: "dance", syllables: 1 },
					{ word: "franchise", syllables: 2 },
					{ word: "freelance", syllables: 2 },
					{ word: "lease", syllables: 1 },
					{ word: "lounge", syllables: 1 },
					{ word: "merchandise", syllables: 3 },
					{ word: "performance", syllables: 3 },
					{ word: "release", syllables: 2 },
					{ word: "resource", syllables: 2 }
				],
				regexAnywhereLetters: [ "(?![nrs])" ]
			},

			// Exclusion words that should be found at the beginning or end of a string, but not if followed by an 'n' or 'r'.
			exclusionsBeginEndNoNR: {
				exclusionParts: [
					{ word: "kite", syllables: 1 },
					{ word: "skate", syllables: 1 }
				],
				matchBeginning: true,
				regexBeginLetters: [ "(?![nr])" ],
				matchEnd: true
			},

			// Exclusion words that should be found at the beginning or end of a string, but not if followed by an 'n', 'r' or 's'.
			exclusionsBeginEndNoNRS: {
				exclusionParts: [
					{ word: "race", syllables: 1 }
				],
				matchBeginning: true,
				regexBeginLetters: [ "(?![nrs])" ]
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
