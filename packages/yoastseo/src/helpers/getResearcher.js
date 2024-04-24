import ArabicResearcher from "../languageProcessing/languages/ar/Researcher";
import CatalanResearcher from "../languageProcessing/languages/ca/Researcher";
import GermanResearcher from "../languageProcessing/languages/de/Researcher";
import EnglishResearcher from "../languageProcessing/languages/en/Researcher";
import SpanishResearcher from "../languageProcessing/languages/es/Researcher";
import FarsiResearcher from "../languageProcessing/languages/fa/Researcher";
import FrenchResearcher from "../languageProcessing/languages/fr/Researcher";
import HebrewResearcher from "../languageProcessing/languages/he/Researcher";
import HungarianResearcher from "../languageProcessing/languages/hu/Researcher";
import IndonesianResearcher from "../languageProcessing/languages/id/Researcher";
import ItalianResearcher from "../languageProcessing/languages/it/Researcher";
import NorwegianResearcher from "../languageProcessing/languages/nb/Researcher";
import DutchResearcher from "../languageProcessing/languages/nl/Researcher";
import PolishResearcher from "../languageProcessing/languages/pl/Researcher";
import PortugueseResearcher from "../languageProcessing/languages/pt/Researcher";
import RussianResearcher from "../languageProcessing/languages/ru/Researcher";
import SwedishResearcher from "../languageProcessing/languages/sv/Researcher";
import TurkishResearcher from "../languageProcessing/languages/tr/Researcher";
import CzechResearcher from "../languageProcessing/languages/cs/Researcher";
import SlovakResearcher from "../languageProcessing/languages/sk/Researcher";
import JapaneseResearcher from "../languageProcessing/languages/ja/Researcher";
import GreekResearcher from "../languageProcessing/languages/el/Researcher";
import DefaultResearcher from "../languageProcessing/languages/_default/Researcher";

const researchers = {
	ar: ArabicResearcher,
	ca: CatalanResearcher,
	de: GermanResearcher,
	en: EnglishResearcher,
	es: SpanishResearcher,
	fa: FarsiResearcher,
	fr: FrenchResearcher,
	he: HebrewResearcher,
	hu: HungarianResearcher,
	id: IndonesianResearcher,
	it: ItalianResearcher,
	nb: NorwegianResearcher,
	nl: DutchResearcher,
	pl: PolishResearcher,
	pt: PortugueseResearcher,
	ru: RussianResearcher,
	sv: SwedishResearcher,
	tr: TurkishResearcher,
	cs: CzechResearcher,
	sk: SlovakResearcher,
	ja: JapaneseResearcher,
	el: GreekResearcher,
};

// Turn the key-value pairs into a Map to prevent a js/unvalidated-dynamic-method-call.
// Refer to https://github.com/Yoast/wordpress-seo/security/code-scanning/45 for details.
const researchersMap = new Map( Object.entries( researchers ) );

/**
 * Retrieves the language-specific Researcher.
 *
 * @param {string} language The language for which to load the correct Researcher.
 *
 * @returns {Object} The Researcher.
 */
export default function getResearcher( language ) {
	if ( researchersMap.has( language ) ) {
		if ( typeof researchersMap.get( language ) === "function" ) {
			return researchersMap.get( language );
		}
	} else {
		return DefaultResearcher;
	}
}
