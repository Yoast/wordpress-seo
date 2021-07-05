import "babel-polyfill";
import AnalysisWebWorker from "../../../packages/yoastseo/src/worker/AnalysisWebWorker";
import getResearcher from "../../../packages/yoastseo/spec/specHelpers/getResearcher";

self.onmessage = ( event ) => {
	const language = event.data.language;

	/*
	 * Use the right researcher depending on the language set. If no specific researcher is available for the language,
	 * use the default researcher.
	 */
	const Researcher = getResearcher( language );

	const worker = new AnalysisWebWorker( self, new Researcher() );
	worker.register();
};
