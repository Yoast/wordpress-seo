import "babel-polyfill";
import { AnalysisWebWorker } from "yoastseo";
import { ArabicResearcher, CatalanResearcher, GermanResearcher, EnglishResearcher, SpanishResearcher, FarsiResearcher, FrenchResearcher,
	HebrewResearcher, HungarianResearcher, IndonesianResearcher, ItalianResearcher, DutchResearcher, PolishResearcher, PortugueseResearcher,
	RussianResearcher, SwedishResearcher, DefaultResearcher } from "yoastseo/src/languageProcessing";

self.onmessage = ( event ) => {
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

	const language = event.data.language;
	/*
	 * Use the right researcher depending on the language set. If no specific researcher is available for the language,
	 * use the default researcher.
	 */
	const Researcher = researchers[ language ] ? researchers[ language ] : DefaultResearcher;

	const worker = new AnalysisWebWorker( self, new Researcher() );
	worker.register();
};
