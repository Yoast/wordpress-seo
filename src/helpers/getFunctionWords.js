/*
 * The script collects all the lists of function words per language and returns this collection to a Researcher or a
 * stringProcessing script
 */

import germanFunctionWordsFactory from "../researches/german/functionWords.js";

const germanFunctionWords = germanFunctionWordsFactory();
import englishFunctionWordsFactory from "../researches/english/functionWords.js";
const englishFunctionWords = englishFunctionWordsFactory();
import dutchFunctionWordsFactory from "../researches/dutch/functionWords.js";
const dutchFunctionWords = dutchFunctionWordsFactory();
import spanishFunctionWordsFactory from "../researches/spanish/functionWords.js";
const spanishFunctionWords = spanishFunctionWordsFactory();
import italianFunctionWordsFactory from "../researches/italian/functionWords.js";
const italianFunctionWords = italianFunctionWordsFactory();
import frenchFunctionWordsFactory from "../researches/french/functionWords.js";
const frenchFunctionWords = frenchFunctionWordsFactory();
import portugueseFunctionWordsFactory from "../researches/portuguese/functionWords.js";
const portugueseFunctionWords = portugueseFunctionWordsFactory();
import russianFunctionWordsFactory from "../researches/russian/functionWords.js";
const russianFunctionWords = russianFunctionWordsFactory();
import polishFunctionWordsFactory from "../researches/polish/functionWords.js";
const polishFunctionWords = polishFunctionWordsFactory();

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
	};
}
