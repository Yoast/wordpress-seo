import ArabicResearcher from "../../src/languageProcessing/languages/ar/Researcher";
import CatalanResearcher from "../../src/languageProcessing/languages/ca/Researcher";
import GermanResearcher from "../../src/languageProcessing/languages/de/Researcher";
import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";
import SpanishResearcher from "../../src/languageProcessing/languages/es/Researcher";
import FarsiResearcher from "../../src/languageProcessing/languages/fa/Researcher";
import FrenchResearcher from "../../src/languageProcessing/languages/fr/Researcher";
import HebrewResearcher from "../../src/languageProcessing/languages/he/Researcher";
import HungarianResearcher from "../../src/languageProcessing/languages/hu/Researcher";
import IndonesianResearcher from "../../src/languageProcessing/languages/id/Researcher";
import ItalianResearcher from "../../src/languageProcessing/languages/it/Researcher";
import NorwegianResearcher from "../../src/languageProcessing/languages/nb/Researcher";
import DutchResearcher from "../../src/languageProcessing/languages/nl/Researcher";
import PolishResearcher from "../../src/languageProcessing/languages/pl/Researcher";
import PortugueseResearcher from "../../src/languageProcessing/languages/pt/Researcher";
import RussianResearcher from "../../src/languageProcessing/languages/ru/Researcher";
import SwedishResearcher from "../../src/languageProcessing/languages/sv/Researcher";
import TurkishResearcher from "../../src/languageProcessing/languages/tr/Researcher";
import CzechResearcher from "../../src/languageProcessing/languages/cs/Researcher";
import SlovakResearcher from "../../src/languageProcessing/languages/sk/Researcher";
import JapaneseResearcher from "../../src/languageProcessing/languages/ja/Researcher";
import GreekResearcher from "../../src/languageProcessing/languages/el/Researcher";
import DefaultResearcher from "../../src/languageProcessing/languages/_default/Researcher";

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

/**
 * Requires language specific Researcher.
 *
 * @param {string} language The language for which to load the correct Researcher.
 *
 * @returns {Object} The Researcher.
 */
export default function getResearcher( language ) {
	if ( researchers[ language ] ) {
		return researchers[ language ];
	}

	return DefaultResearcher;
}
