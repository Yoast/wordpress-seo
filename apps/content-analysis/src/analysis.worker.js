import "babel-polyfill";
import { AnalysisWebWorker } from "yoastseo";
import { EnglishResearcher, DutchResearcher } from "yoastseo/src/languageProcessing";

const researchers = {
	en: EnglishResearcher,
	nl: DutchResearcher,
};

// @todo how can we get the right locale?
const Researcher = researchers.en;

const worker = new AnalysisWebWorker( self, new Researcher() );
worker.register();
