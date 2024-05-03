import { AnalysisWebWorker } from "yoastseo";
import EnglishResearcher from "yoastseo/build/languageProcessing/languages/en/Researcher";

const worker = new AnalysisWebWorker( self, new EnglishResearcher() );
// Any custom registration should be done here (or send messages via postMessage to the wrapper).
worker.register();
