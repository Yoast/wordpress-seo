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
// Store blog posts and pages assessors.
import StorePostsAndPagesSEOAssessor from "yoastseo/src/scoring/storePostsAndPages/seoAssessor";
import StorePostsAndPagesCornerstoneSEOAssessor from "yoastseo/src/scoring/storePostsAndPages/cornerstone/seoAssessor";
import StorePostsAndPagesContentAssessor from "yoastseo/src/scoring/storePostsAndPages/contentAssessor";
import StorePostsAndPagesCornerstoneContentAssessor
	from "yoastseo/src/scoring/storePostsAndPages/cornerstone/contentAssessor";
import StorePostsAndPagesRelatedKeywordAssessor from "yoastseo/src/scoring/storePostsAndPages/relatedKeywordAssessor";
import StorePostsAndPagesCornerstoneRelatedKeywordAssessor
	from "yoastseo/src/scoring/storePostsAndPages/cornerstone/relatedKeywordAssessor";
// Collection page assessors.
import CollectionSEOAssessor from "yoastseo/src/scoring/collectionPages/seoAssessor";
import CollectionCornerstoneSEOAssessor from "yoastseo/src/scoring/collectionPages/cornerstone/seoAssessor";
import CollectionRelatedKeywordAssessor from "yoastseo/src/scoring/collectionPages/relatedKeywordAssessor";
import CollectionCornerstoneRelatedKeywordAssessor from "yoastseo/src/scoring/collectionPages/cornerstone/relatedKeywordAssessor";


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
	// Store posts and pages.
	worker.setCustomSEOAssessorClass( StorePostsAndPagesSEOAssessor, "storePostsAndPages" );
	worker.setCustomCornerstoneSEOAssessorClass( StorePostsAndPagesCornerstoneSEOAssessor, "storePostsAndPages" );
	worker.setCustomContentAssessorClass( StorePostsAndPagesContentAssessor, "storePostsAndPages" );
	worker.setCustomCornerstoneContentAssessorClass( StorePostsAndPagesCornerstoneContentAssessor, "storePostsAndPages" );
	worker.setCustomRelatedKeywordAssessorClass( StorePostsAndPagesRelatedKeywordAssessor, "storePostsAndPages" );
	worker.setCustomCornerstoneRelatedKeywordAssessorClass( StorePostsAndPagesCornerstoneRelatedKeywordAssessor, "storePostsAndPages" );
	// Store collection pages.
	worker.setCustomSEOAssessorClass( CollectionSEOAssessor, "collectionPage" );
	worker.setCustomCornerstoneSEOAssessorClass( CollectionCornerstoneSEOAssessor, "collectionPage" );
	worker.setCustomRelatedKeywordAssessorClass( CollectionRelatedKeywordAssessor, "collectionPage"  );
	worker.setCustomCornerstoneRelatedKeywordAssessorClass( CollectionCornerstoneRelatedKeywordAssessor, "collectionPage"  );
	worker.setCustomContentAssessorClass( StorePostsAndPagesContentAssessor, "collectionPage" );
	worker.setCustomCornerstoneContentAssessorClass( StorePostsAndPagesCornerstoneContentAssessor, "collectionPage" );

	worker.register();
};
