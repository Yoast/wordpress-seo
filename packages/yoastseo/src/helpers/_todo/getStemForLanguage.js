import { determineStem as englishDetermineStem } from "../../languageProcessing/languages/en/morphology/determineStem";
import { determineStem as germanDetermineStem } from "../../languageProcessing/languages/de/morphology/determineStem";
import { determineStem as dutchDetermineStem } from "../../languageProcessing/languages/nl/morphology/determineStem";
import spanishDetermineStem from "../../languageProcessing/languages/es/morphology/stem";
import frenchDetermineStem from "../../languageProcessing/languages/fr/morphology/stem";
import russianDetermineStem from "../../languageProcessing/languages/ru/morphology/stem";
import italianDetermineStem from "../../languageProcessing/languages/it/morphology/stem";
import portugueseDetermineStem from "../../languageProcessing/languages/pt/morphology/stem";
import indonesianDetermineStem from "../../languageProcessing/languages/id/morphology/stem";
import polishDetermineStem from "../../languageProcessing/languages/pl/morphology/stem";
import arabicDetermineStem from "../../languageProcessing/languages/ar/morphology/stem";

/**
 * Collects all functions for determining a stem per language and returns this collection to a Researcher
 *
 * @returns {Object} Forms to be searched for keyword-based assessments for all available languages.
 */
export default function() {
	return {
		en: englishDetermineStem,
		de: germanDetermineStem,
		nl: dutchDetermineStem,
		es: spanishDetermineStem,
		fr: frenchDetermineStem,
		ru: russianDetermineStem,
		it: italianDetermineStem,
		pt: portugueseDetermineStem,
		id: indonesianDetermineStem,
		pl: polishDetermineStem,
		ar: arabicDetermineStem,
	};
}
