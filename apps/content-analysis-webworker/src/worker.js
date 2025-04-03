import { AnalysisWebWorker } from "yoastseo";

self.onmessage = ( event ) => {
	// Set the language for the Researcher
	const language = event.data.language;
	// eslint-disable-next-line global-require
	const { "default": Researcher } = require( `yoastseo/build/languageProcessing/languages/${language}/Researcher` );
	const researcher = new Researcher();

	// Optionally add Premium configuration here, see the example in apps/content-analysis-api/helpers/get-researcher.js

	// Start the worker!
	const worker = new AnalysisWebWorker( self, researcher );
	worker.register();
};
