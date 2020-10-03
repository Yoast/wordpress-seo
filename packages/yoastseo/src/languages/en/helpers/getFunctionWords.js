/*
 * The script collects all the lists of function words per language and returns this collection to a Researcher or a
 * stringProcessing script
 */

import germanFunctionWordsFactory from "../researches/de/functionWords.js";

const germanFunctionWords = germanFunctionWordsFactory();
import englishFunctionWordsFactory from "../config/passiveVoice/functionWords.js";
const englishFunctionWords = englishFunctionWordsFactory();
import dutchFunctionWordsFactory from "../researches/nl/functionWords.js";
const dutchFunctionWords = dutchFunctionWordsFactory();
import spanishFunctionWordsFactory from "../researches/es/functionWords.js";
const spanishFunctionWords = spanishFunctionWordsFactory();
import italianFunctionWordsFactory from "../researches/it/functionWords.js";
const italianFunctionWords = italianFunctionWordsFactory();
import frenchFunctionWordsFactory from "../researches/fr/functionWords.js";
const frenchFunctionWords = frenchFunctionWordsFactory();
import portugueseFunctionWordsFactory from "../researches/pt/functionWords.js";
const portugueseFunctionWords = portugueseFunctionWordsFactory();
import russianFunctionWordsFactory from "../researches/ru/functionWords.js";
const russianFunctionWords = russianFunctionWordsFactory();
import polishFunctionWordsFactory from "../researches/pl/functionWords.js";
const polishFunctionWords = polishFunctionWordsFactory();
import swedishFunctionWordsFactory from "../researches/sv/functionWords.js";
const swedishFunctionWords = swedishFunctionWordsFactory();
import indonesianFunctionWordsFactory from "../researches/id/functionWords.js";
const indonesianFunctionWords = indonesianFunctionWordsFactory();
import hebrewFunctionWordsFactory from "../researches/he/functionWords.js";
const hebrewFunctionWords = hebrewFunctionWordsFactory();
import arabicFunctionWordsFactory from "../researches/ar/functionWords.js";
const arabicFunctionWords = arabicFunctionWordsFactory();
import farsiFunctionWordsFactory from "../researches/fa/functionWords.js";
const farsiFunctionWords = farsiFunctionWordsFactory();

/**
 * Returns the function words for all languages.
 *
 * @returns {Object} Function words for all languages.
 */
export default function() {
	return {
		en: englishFunctionWords,
		de: germanFunctionWords,
		nl: dutchFunctionWords,
		fr: frenchFunctionWords,
		es: spanishFunctionWords,
		it: italianFunctionWords,
		pt: portugueseFunctionWords,
		ru: russianFunctionWords,
		pl: polishFunctionWords,
		sv: swedishFunctionWords,
		id: indonesianFunctionWords,
		he: hebrewFunctionWords,
		ar: arabicFunctionWords,
		fa: farsiFunctionWords,
	};
}
