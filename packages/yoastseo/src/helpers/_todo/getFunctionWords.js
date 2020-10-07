/*
 * The script collects all the lists of function words per language and returns this collection to a Researcher or a
 * stringProcessing script
 */

import germanFunctionWordsFactory from "../../languageProcessing/languages/de/config/functionWords.js";
const germanFunctionWords = germanFunctionWordsFactory();
import englishFunctionWordsFactory from "../../languageProcessing/languages/en/config/functionWords.js";
const englishFunctionWords = englishFunctionWordsFactory();
import dutchFunctionWordsFactory from "../../languageProcessing/languages/nl/config/functionWords.js";
const dutchFunctionWords = dutchFunctionWordsFactory();
import spanishFunctionWordsFactory from "../../languageProcessing/languages/es/config/functionWords.js";
const spanishFunctionWords = spanishFunctionWordsFactory();
import italianFunctionWordsFactory from "../../languageProcessing/languages/it/config/functionWords.js";
const italianFunctionWords = italianFunctionWordsFactory();
import frenchFunctionWordsFactory from "../../languageProcessing/languages/fr/config/functionWords.js";
const frenchFunctionWords = frenchFunctionWordsFactory();
import portugueseFunctionWordsFactory from "../../languageProcessing/languages/pt/config/functionWords.js";
const portugueseFunctionWords = portugueseFunctionWordsFactory();
import russianFunctionWordsFactory from "../../languageProcessing/languages/ru/config/functionWords.js";
const russianFunctionWords = russianFunctionWordsFactory();
import polishFunctionWordsFactory from "../../languageProcessing/languages/pl/config/functionWords.js";
const polishFunctionWords = polishFunctionWordsFactory();
import swedishFunctionWordsFactory from "../../languageProcessing/languages/sv/config/functionWords.js";
const swedishFunctionWords = swedishFunctionWordsFactory();
import indonesianFunctionWordsFactory from "../../languageProcessing/languages/id/config/functionWords.js";
const indonesianFunctionWords = indonesianFunctionWordsFactory();
import hebrewFunctionWordsFactory from "../../languageProcessing/languages/he/config/functionWords.js";
const hebrewFunctionWords = hebrewFunctionWordsFactory();
import arabicFunctionWordsFactory from "../../languageProcessing/languages/ar/config/functionWords.js";
const arabicFunctionWords = arabicFunctionWordsFactory();
import farsiFunctionWordsFactory from "../../languageProcessing/languages/fa/config/functionWords.js";
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
