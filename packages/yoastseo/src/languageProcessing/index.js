import replaceDiacritics from "./helpers/transliterate/replaceDiacritics";
import transliterate from "./helpers/transliterate/transliterate";
import createRegexFromArray from "./helpers/regex/createRegexFromArray";
import ArabicResearcher from "./languages/ar/Researcher";
import CatalanResearcher from "./languages/ca/Researcher";
import GermanResearcher from "./languages/de/Researcher";
import EnglishResearcher from "./languages/en/Researcher";
import SpanishResearcher from "./languages/es/Researcher";
import FarsiResearcher from "./languages/fa/Researcher";
import FrenchResearcher from "./languages/fr/Researcher";
import HebrewResearcher from "./languages/he/Researcher";
import HungarianResearcher from "./languages/hu/Researcher";
import IndonesianResearcher from "./languages/id/Researcher";
import ItalianResearcher from "./languages/it/Researcher";
import NorwegianResearcher from "./languages/nb/Researcher";
import DutchResearcher from "./languages/nl/Researcher";
import PolishResearcher from "./languages/pl/Researcher";
import PortugueseResearcher from "./languages/pt/Researcher";
import RussianResearcher from "./languages/ru/Researcher";
import SwedishResearcher from "./languages/sv/Researcher";
import TurkishResearcher from "./languages/tr/Researcher";
import DefaultResearcher from "./languages/_default/Researcher";

export {
	ArabicResearcher,
	CatalanResearcher,
	GermanResearcher,
	EnglishResearcher,
	SpanishResearcher,
	FarsiResearcher,
	FrenchResearcher,
	HebrewResearcher,
	HungarianResearcher,
	IndonesianResearcher,
	ItalianResearcher,
	NorwegianResearcher,
	DutchResearcher,
	PolishResearcher,
	PortugueseResearcher,
	RussianResearcher,
	SwedishResearcher,
	TurkishResearcher,
	DefaultResearcher,

	transliterate,
	replaceDiacritics,
	createRegexFromArray,
};
