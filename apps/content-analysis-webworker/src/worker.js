import { AnalysisWebWorker } from "yoastseo";
import getResearcher from "yoastseo/researcher";

self.onmessage = ( event ) => {
	// Set the language for the Researcher
	const language = event.data.language;
	// Resolve the language-specific Researcher class through the public entry instead of
	// deep-requiring `yoastseo/build/...`.
	const Researcher = getResearcher( language );
	const researcher = new Researcher();

	// Optionally add Premium configuration here, see the example in apps/content-analysis-api/helpers/get-researcher.js

	// Start the worker!
	const worker = new AnalysisWebWorker( self, researcher );
	worker.register();
};
