import { determineStem as englishDetermineStem } from "../../stringProcessing/languages/en/morphology/determineStem";
import { determineStem as germanDetermineStem } from "../../stringProcessing/languages/de/morphology/determineStem";
import { determineStem as dutchDetermineStem } from "../../stringProcessing/languages/nl/morphology/determineStem";
import spanishDetermineStem from "../../stringProcessing/languages/es/morphology/stem";
import frenchDetermineStem from "../../stringProcessing/languages/fr/morphology/stem";
import russianDetermineStem from "../../stringProcessing/languages/ru/morphology/stem";
import italianDetermineStem from "../../stringProcessing/languages/it/morphology/stem";
import portugueseDetermineStem from "../../stringProcessing/languages/pt/morphology/stem";
import indonesianDetermineStem from "../../stringProcessing/languages/id/morphology/stem";
import polishDetermineStem from "../../stringProcessing/languages/pl/morphology/stem";
import arabicDetermineStem from "../../stringProcessing/languages/ar/morphology/stem";

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
