import {
	ArabicResearcher,
	CatalanResearcher,
	DutchResearcher,
	EnglishResearcher,
	FarsiResearcher,
	FrenchResearcher,
	GermanResearcher,
	HebrewResearcher,
	HungarianResearcher,
	IndonesianResearcher,
	ItalianResearcher,
	PolishResearcher,
	PortugueseResearcher,
	RussianResearcher,
	SpanishResearcher,
	SwedishResearcher,
	NorwegianResearcher,
	TurkishResearcher,
	DefaultResearcher,
} from "../../src/languageProcessing";


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
