import ArabicResearcher from "./languages/ar/Researcher";
import CatalanResearcher from "./languages/ca/Researcher";
import CzechResearcher from "./languages/cs/Researcher";
import GermanResearcher from "./languages/de/Researcher";
import GreekResearcher from "./languages/el/Researcher";
import EnglishResearcher from "./languages/en/Researcher";
import SpanishResearcher from "./languages/es/Researcher";
import FarsiResearcher from "./languages/fa/Researcher";
import FrenchResearcher from "./languages/fr/Researcher";
import HebrewResearcher from "./languages/he/Researcher";
import HungarianResearcher from "./languages/hu/Researcher";
import IndonesianResearcher from "./languages/id/Researcher";
import ItalianResearcher from "./languages/it/Researcher";
import JapaneseResearcher from "./languages/ja/Researcher";
import NorwegianResearcher from "./languages/nb/Researcher";
import DutchResearcher from "./languages/nl/Researcher";
import PolishResearcher from "./languages/pl/Researcher";
import PortugueseResearcher from "./languages/pt/Researcher";
import RussianResearcher from "./languages/ru/Researcher";
import SlovakResearcher from "./languages/sk/Researcher";
import SwedishResearcher from "./languages/sv/Researcher";
import TurkishResearcher from "./languages/tr/Researcher";
import DefaultResearcher from "./languages/_default/Researcher";

/**
 * @typedef {import("../values/Paper").default} Paper
 * @typedef {import("./AbstractResearcher").Researcher} Researcher
 */

/**
 * The language-specific Researcher class: a constructor. Instantiate it with `new` to get a
 * {@link Researcher} instance.
 *
 * @typedef {new (paper?: Paper) => Researcher} ResearcherClass
 */

/*
 * This factory is deliberately NOT re-exported from the package root (`src/index.js`); it is shipped as
 * its own entry point, `yoastseo/researcher`. The split is a conscious optimisation for consumers that
 * load `yoastseo` as a bundler "external" — that is, the package root is provided once as a shared global
 * (or shared chunk) rather than bundled into every consumer. Yoast SEO for WordPress does this (it exposes
 * the root as the `window.yoast.analysis` global), but any webpack/Rollup setup can configure `yoastseo`
 * as an external the same way.
 *
 * Each language Researcher transitively imports that language's data — function words, stemmers, transition
 * words, etc. Re-exporting this factory from the package root would therefore pull *every* language
 * (~2.4 MB) into whatever bundle imports the root, defeating that optimisation (measured: re-exporting from
 * the root grew one such shared bundle from ~0.9 MB to ~2.8 MB). Keeping the factory on its own entry that
 * the root never imports lets those consumers keep the shared root lean and load only the languages they
 * actually need.
 *
 * Importing this module also avoids the circular-dependency error that blocked exposing the factory from
 * the root: language Researchers import the analysis core via the package root, so as long as the root does
 * not import the Researchers, loading a Researcher initialises the root first and resolves cleanly.
 */
const researchers = {
	ar: ArabicResearcher,
	ca: CatalanResearcher,
	cs: CzechResearcher,
	de: GermanResearcher,
	el: GreekResearcher,
	en: EnglishResearcher,
	es: SpanishResearcher,
	fa: FarsiResearcher,
	fr: FrenchResearcher,
	he: HebrewResearcher,
	hu: HungarianResearcher,
	id: IndonesianResearcher,
	it: ItalianResearcher,
	ja: JapaneseResearcher,
	nb: NorwegianResearcher,
	nl: DutchResearcher,
	pl: PolishResearcher,
	pt: PortugueseResearcher,
	ru: RussianResearcher,
	sk: SlovakResearcher,
	sv: SwedishResearcher,
	tr: TurkishResearcher,
};

// A Map prevents a js/unvalidated-dynamic-method-call when looking up by an arbitrary language code.
const researchersMap = new Map( Object.entries( researchers ) );

/**
 * Resolves the language-specific Researcher class, falling back to the default Researcher when the
 * language is not supported.
 *
 * Accepts either a bare language code (`nl`) or a locale (`nl_NL`)/(`nl-NL`); a locale is reduced to its language
 * part before lookup, matching how the rest of the package derives a language from a locale.
 *
 * @param {string} [languageOrLocale] The language code or locale to resolve the Researcher for.
 *
 * @returns {ResearcherClass} The language-specific Researcher class; instantiate it with `new` to get a
 *                            {@link Researcher} instance.
 */
export default function getResearcher( languageOrLocale ) {
	const language = ( languageOrLocale || "" ).split( /[-_]/ )[ 0 ].toLowerCase();
	return researchersMap.get( language ) || DefaultResearcher;
}
