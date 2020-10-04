/*
 * The script collects all the lists of function words per language and returns this collection to a Researcher or a
 * stringProcessing script
 */

import germanFunctionWordsFactory from "../../stringProcessing/languages/de/config/functionWords.js";
const germanFunctionWords = germanFunctionWordsFactory();
import englishFunctionWordsFactory from "../../stringProcessing/languages/en/config/functionWords.js";
const englishFunctionWords = englishFunctionWordsFactory();
import dutchFunctionWordsFactory from "../../stringProcessing/languages/nl/config/functionWords.js";
const dutchFunctionWords = dutchFunctionWordsFactory();
import spanishFunctionWordsFactory from "../../stringProcessing/languages/es/config/functionWords.js";
const spanishFunctionWords = spanishFunctionWordsFactory();
import italianFunctionWordsFactory from "../../stringProcessing/languages/it/config/functionWords.js";
const italianFunctionWords = italianFunctionWordsFactory();
import frenchFunctionWordsFactory from "../../stringProcessing/languages/fr/config/functionWords.js";
const frenchFunctionWords = frenchFunctionWordsFactory();
import portugueseFunctionWordsFactory from "../../stringProcessing/languages/pt/config/functionWords.js";
const portugueseFunctionWords = portugueseFunctionWordsFactory();
import russianFunctionWordsFactory from "../../stringProcessing/languages/ru/config/functionWords.js";
const russianFunctionWords = russianFunctionWordsFactory();
import polishFunctionWordsFactory from "../../stringProcessing/languages/pl/config/functionWords.js";
const polishFunctionWords = polishFunctionWordsFactory();
import swedishFunctionWordsFactory from "../../stringProcessing/languages/sv/config/functionWords.js";
const swedishFunctionWords = swedishFunctionWordsFactory();
import indonesianFunctionWordsFactory from "../../stringProcessing/languages/id/config/functionWords.js";
const indonesianFunctionWords = indonesianFunctionWordsFactory();
import hebrewFunctionWordsFactory from "../../stringProcessing/languages/he/config/functionWords.js";
const hebrewFunctionWords = hebrewFunctionWordsFactory();
import arabicFunctionWordsFactory from "../../stringProcessing/languages/ar/config/functionWords.js";
const arabicFunctionWords = arabicFunctionWordsFactory();
import farsiFunctionWordsFactory from "../../stringProcessing/languages/fa/config/functionWords.js";
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
