import "babel-polyfill";
import { AnalysisWebWorker } from "yoastseo";
import { ArabicResearcher, CatalanResearcher, GermanResearcher, EnglishResearcher, SpanishResearcher, FarsiResearcher, FrenchResearcher,
	HebrewResearcher, HungarianResearcher, IndonesianResearcher, ItalianResearcher, DutchResearcher, PolishResearcher, PortugueseResearcher,
	RussianResearcher, SwedishResearcher, DefaultResearcher } from "yoastseo/src/languageProcessing";

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
	nl: DutchResearcher,
	pl: PolishResearcher,
	pt: PortugueseResearcher,
	ru: RussianResearcher,
	sv: SwedishResearcher,
};

// @todo how can we get the right locale?
const Researcher = researchers.en;

const worker = new AnalysisWebWorker( self, new Researcher() );
worker.register();
