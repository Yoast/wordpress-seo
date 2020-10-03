import { determineStem as englishDetermineStem } from "../morphology/determineStem";
import { determineStem as germanDetermineStem } from "../morphology/de/determineStem";
import { determineStem as dutchDetermineStem } from "../morphology/nl/determineStem";
import spanishDetermineStem from "../morphology/es/stem";
import frenchDetermineStem from "../morphology/fr/stem";
import russianDetermineStem from "../morphology/ru/stem";
import italianDetermineStem from "../morphology/it/stem";
import portugueseDetermineStem from "../morphology/pt/stem";
import indonesianDetermineStem from "../morphology/id/stem";
import polishDetermineStem from "../morphology/pl/stem";
import arabicDetermineStem from "../morphology/ar/stem";

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
