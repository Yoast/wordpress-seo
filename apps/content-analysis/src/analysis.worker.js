import "babel-polyfill";
import AnalysisWebWorker from "../../../packages/yoastseo/src/worker/AnalysisWebWorker";
import getResearcher from "../../../packages/yoastseo/spec/specHelpers/getResearcher";
// import productSEOAssessor from "yoastseo/src/scoring/productPages/seoAssessor";
// import productCornerstoneSEOAssessor from "yoastseo/src/scoring/productPages/cornerstone/seoAssessor";
// import productContentAssessor from "yoastseo/src/scoring/productPages/contentAssessor";
// import productCornerstoneContentAssessor from "yoastseo/src/scoring/productPages/cornerstone/contentAssessor";
// import productRelatedKeywordAssessor from "yoastseo/src/scoring/productPages/relatedKeywordAssessor";
// import productCornerstoneRelatedKeywordAssessor from "yoastseo/src/scoring/productPages/cornerstone/relatedKeywordAssessor";

self.onmessage = ( event ) => {
	const language = event.data.language;

	/*
	 * Use the right researcher depending on the language set. If no specific researcher is available for the language,
	 * use the default researcher.
	 */
	const Researcher = getResearcher( language );

	const worker = new AnalysisWebWorker( self, new Researcher() );

	/*
	 * Uncomment the following lines to use the specific assessors for product pages:
	 * (Later we should implement a toggle for this.)
	 */
	// worker.setCustomSEOAssessorClass( productSEOAssessor );
	// worker.setCustomCornerstoneSEOAssessorClass( productCornerstoneSEOAssessor );
	// worker.setCustomContentAssessorClass( productContentAssessor );
	// worker.setCustomCornerstoneContentAssessorClass( productCornerstoneContentAssessor );
	// worker.setCustomRelatedKeywordAssessorClass( productRelatedKeywordAssessor );
	// worker.setCustomCornerstoneRelatedKeywordAssessorClass( productCornerstoneRelatedKeywordAssessor );

	worker.register();
};
