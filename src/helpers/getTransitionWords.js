import transitionWordsEnglishFactory from "../researches/english/transitionWords.js";
let transitionWordsEnglish = transitionWordsEnglishFactory().allWords;
import twoPartTransitionWordsEnglish from "../researches/english/twoPartTransitionWords.js";

import transitionWordsGermanFactory from "../researches/german/transitionWords.js";
let transitionWordsGerman = transitionWordsGermanFactory().allWords;
import twoPartTransitionWordsGerman from "../researches/german/twoPartTransitionWords.js";

import transitionWordsFrenchFactory from "../researches/french/transitionWords.js";
let transitionWordsFrench = transitionWordsFrenchFactory().allWords;
import twoPartTransitionWordsFrench from "../researches/french/twoPartTransitionWords.js";

import transitionWordsSpanishFactory from "../researches/spanish/transitionWords.js";
let transitionWordsSpanish = transitionWordsSpanishFactory().allWords;
import twoPartTransitionWordsSpanish from "../researches/spanish/twoPartTransitionWords.js";

import transitionWordsDutchFactory from "../researches/dutch/transitionWords.js";
let transitionWordsDutch = transitionWordsDutchFactory().allWords;
import twoPartTransitionWordsDutch from "../researches/dutch/twoPartTransitionWords.js";

import transitionWordsItalianFactory from "../researches/italian/transitionWords.js";
let transitionWordsItalian = transitionWordsItalianFactory().allWords;
import twoPartTransitionWordsItalian from "../researches/italian/twoPartTransitionWords.js";

import transitionWordsPortugueseFactory from "../researches/portuguese/transitionWords.js";
let transitionWordsPortuguese = transitionWordsPortugueseFactory().allWords;
import twoPartTransitionWordsPortuguese from "../researches/portuguese/twoPartTransitionWords.js";

import transitionWordsRussianFactory from "../researches/russian/transitionWords.js";
let transitionWordsRussian = transitionWordsRussianFactory().allWords;
import twoPartTransitionWordsRussian from "../researches/russian/twoPartTransitionWords.js";

import transitionWordsCatalanFactory from "../researches/catalan/transitionWords.js";
let transitionWordsCatalan = transitionWordsCatalanFactory().allWords;
import twoPartTransitionWordsCatalan from "../researches/catalan/twoPartTransitionWords.js";

import transitionWordsPolishFactory from "../researches/polish/transitionWords.js";
let transitionWordsPolish = transitionWordsPolishFactory().allWords;

import twoPartTransitionWordsPolish from "../researches/polish/twoPartTransitionWords.js";
import getLanguage from "./getLanguage.js";

/**
 * Returns transition words for a specific locale.
 *
 * @param {string} locale The locale to return function words for.
 *
 * @returns {Object} The function words for a locale.
 */
export default function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: twoPartTransitionWordsGerman,
			};
		case "es":
			return {
				transitionWords: transitionWordsSpanish,
				twoPartTransitionWords: twoPartTransitionWordsSpanish,
			};
		case "fr":
			return {
				transitionWords: transitionWordsFrench,
				twoPartTransitionWords: twoPartTransitionWordsFrench,
			};
		case "nl":
			return {
				transitionWords: transitionWordsDutch,
				twoPartTransitionWords: twoPartTransitionWordsDutch,
			};
		case "it":
			return {
				transitionWords: transitionWordsItalian,
				twoPartTransitionWords: twoPartTransitionWordsItalian,
			};
		case "pt":
			return {
				transitionWords: transitionWordsPortuguese,
				twoPartTransitionWords: twoPartTransitionWordsPortuguese,
			};
		case "ru":
			return {
				transitionWords: transitionWordsRussian,
				twoPartTransitionWords: twoPartTransitionWordsRussian,
			};
		case "ca":
			return {
				transitionWords: transitionWordsCatalan,
				twoPartTransitionWords: twoPartTransitionWordsCatalan,
			};
		case "pl":
			return {
				transitionWords: transitionWordsPolish,
				twoPartTransitionWords: twoPartTransitionWordsPolish,
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: twoPartTransitionWordsEnglish,
			};
	}
}
