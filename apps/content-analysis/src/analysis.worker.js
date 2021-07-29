import "babel-polyfill";
import AnalysisWebWorker from "../../../packages/yoastseo/src/worker/AnalysisWebWorker";
import getResearcher from "../../../packages/yoastseo/spec/specHelpers/getResearcher";
// Product page assessors.
import productSEOAssessor from "yoastseo/src/scoring/productPages/seoAssessor";
import productCornerstoneSEOAssessor from "yoastseo/src/scoring/productPages/cornerstone/seoAssessor";
import productContentAssessor from "yoastseo/src/scoring/productPages/contentAssessor";
import productCornerstoneContentAssessor from "yoastseo/src/scoring/productPages/cornerstone/contentAssessor";
import productRelatedKeywordAssessor from "yoastseo/src/scoring/productPages/relatedKeywordAssessor";
import productCornerstoneRelatedKeywordAssessor from "yoastseo/src/scoring/productPages/cornerstone/relatedKeywordAssessor";
// Store blog assessors.
import StoreBlogSEOAssessor from "yoastseo/src/scoring/storeBlog/seoAssessor";
import StoreBlogCornerstoneSEOAssessor from "yoastseo/src/scoring/storeBlog/cornerstone/seoAssessor";


self.onmessage = ( event ) => {
	const language = event.data.language;

	/*
	 * Use the right researcher depending on the language set. If no specific researcher is available for the language,
	 * use the default researcher.
	 */
	const Researcher = getResearcher( language );

	const worker = new AnalysisWebWorker( self, new Researcher() );

	// Set custom assessors.
	// Store product pages.
	worker.setCustomSEOAssessorClass( productSEOAssessor, "productPage" );
	worker.setCustomCornerstoneSEOAssessorClass( productCornerstoneSEOAssessor, "productPage" );
	worker.setCustomContentAssessorClass( productContentAssessor, "productPage"  );
	worker.setCustomCornerstoneContentAssessorClass( productCornerstoneContentAssessor, "productPage"  );
	worker.setCustomRelatedKeywordAssessorClass( productRelatedKeywordAssessor, "productPage"  );
	worker.setCustomCornerstoneRelatedKeywordAssessorClass( productCornerstoneRelatedKeywordAssessor, "productPage"  );
	// Store blog.
	worker.setCustomSEOAssessorClass( StoreBlogSEOAssessor, "storeBlog" );
	worker.setCustomCornerstoneSEOAssessorClass( StoreBlogCornerstoneSEOAssessor, "storeBlog" );
	worker.setCustomRelatedKeywordAssessorClass( StoreBlogRelatedKeywordAssessor, "storeBlog" );
	// Store posts and pages.
	// Store collection pages.

	worker.register();
};
