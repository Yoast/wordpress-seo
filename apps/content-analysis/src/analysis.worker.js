import "babel-polyfill";
import { AnalysisWebWorker, assessors } from "yoastseo";
import getResearcher from "yoastspec/specHelpers/getResearcher";

const {
	// Product page assessors.
	ProductSEOAssessor,
	ProductCornerstoneSEOAssessor,
	ProductContentAssessor,
	ProductCornerstoneContentAssessor,
	ProductRelatedKeywordAssessor,
	ProductCornerstoneRelatedKeywordAssessor,
	// Store blog assessors.
	StoreBlogSEOAssessor,
	StoreBlogCornerstoneSEOAssessor,
	// Store posts and pages assessors.
	StorePostsAndPagesSEOAssessor,
	StorePostsAndPagesCornerstoneSEOAssessor,
	StorePostsAndPagesContentAssessor,
	StorePostsAndPagesCornerstoneContentAssessor,
	StorePostsAndPagesRelatedKeywordAssessor,
	StorePostsAndPagesCornerstoneRelatedKeywordAssessor,
	// Store collection page assessors.
	CollectionSEOAssessor,
	CollectionCornerstoneSEOAssessor,
	CollectionRelatedKeywordAssessor,
	CollectionCornerstoneRelatedKeywordAssessor,
} = assessors;

import registerPremiumAssessments from "./utils/registerPremiumAssessments";

self.onmessage = ( event ) => {
	const language = event.data.language;

	/*
	 * Use the right researcher depending on the language set. If no specific researcher is available for the language,
	 * use the default researcher.
	 */
	const Researcher = getResearcher( language );

	const worker = new AnalysisWebWorker( self, new Researcher() );

	registerPremiumAssessments( worker, language );

	// Set custom assessors.
	// Store product pages.
	worker.setCustomSEOAssessorClass( ProductSEOAssessor, "productPage", { introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		metaDescriptionLengthUrlTitle: "https://yoa.st/shopify46",
		metaDescriptionLengthCTAUrl: "https://yoa.st/shopify47",
		subheadingsKeyphraseUrlTitle: "https://yoa.st/shopify16",
		subheadingsKeyphraseCTAUrl: "https://yoa.st/shopify17",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		textLengthUrlTitle: "https://yoa.st/shopify58",
		textLengthCTAUrl: "https://yoa.st/shopify59",
		titleKeyphraseUrlTitle: "https://yoa.st/shopify24",
		titleKeyphraseCTAUrl: "https://yoa.st/shopify25",
		titleWidthUrlTitle: "https://yoa.st/shopify52",
		titleWidthCTAUrl: "https://yoa.st/shopify53",
		urlKeyphraseUrlTitle: "https://yoa.st/shopify26",
		urlKeyphraseCTAUrl: "https://yoa.st/shopify27",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		singleH1UrlTitle: "https://yoa.st/shopify54",
		singleH1CTAUrl: "https://yoa.st/shopify55",
		imageCountUrlTitle: "https://yoa.st/shopify20",
		imageCountCTAUrl: "https://yoa.st/shopify21",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
		imageAltTagsUrlTitle: "https://yoa.st/shopify40",
		imageAltTagsCTAUrl: "https://yoa.st/shopify41",
		keyphraseDistributionUrlTitle: "https://yoa.st/shopify30",
		keyphraseDistributionCTAUrl: "https://yoa.st/shopify31",
	} );
	worker.setCustomCornerstoneSEOAssessorClass( ProductCornerstoneSEOAssessor, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		metaDescriptionLengthUrlTitle: "https://yoa.st/shopify46",
		metaDescriptionLengthCTAUrl: "https://yoa.st/shopify47",
		subheadingsKeyphraseUrlTitle: "https://yoa.st/shopify16",
		subheadingsKeyphraseCTAUrl: "https://yoa.st/shopify17",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		textLengthUrlTitle: "https://yoa.st/shopify58",
		textLengthCTAUrl: "https://yoa.st/shopify59",
		titleKeyphraseUrlTitle: "https://yoa.st/shopify24",
		titleKeyphraseCTAUrl: "https://yoa.st/shopify25",
		titleWidthUrlTitle: "https://yoa.st/shopify52",
		titleWidthCTAUrl: "https://yoa.st/shopify53",
		urlKeyphraseUrlTitle: "https://yoa.st/shopify26",
		urlKeyphraseCTAUrl: "https://yoa.st/shopify27",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		singleH1UrlTitle: "https://yoa.st/shopify54",
		singleH1CTAUrl: "https://yoa.st/shopify55",
		imageCountUrlTitle: "https://yoa.st/shopify20",
		imageCountCTAUrl: "https://yoa.st/shopify21",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
		imageAltTagsUrlTitle: "https://yoa.st/shopify40",
		imageAltTagsCTAUrl: "https://yoa.st/shopify41",
		keyphraseDistributionUrlTitle: "https://yoa.st/shopify30",
		keyphraseDistributionCTAUrl: "https://yoa.st/shopify31",
	} );
	worker.setCustomContentAssessorClass( ProductContentAssessor, "productPage", {
		subheadingUrlTitle: "https://yoa.st/shopify68",
		subheadingCTAUrl: "https://yoa.st/shopify69",
		paragraphUrlTitle: "https://yoa.st/shopify66",
		paragraphCTAUrl: "https://yoa.st/shopify67",
		sentenceLengthUrlTitle: "https://yoa.st/shopify48",
		sentenceLengthCTAUrl: "https://yoa.st/shopify49",
		transitionWordsUrlTitle: "https://yoa.st/shopify44",
		transitionWordsCTAUrl: "https://yoa.st/shopify45",
		passiveVoiceUrlTitle: "https://yoa.st/shopify42",
		passiveVoiceCTAUrl: "https://yoa.st/shopify43",
		textPresenceUrlTitle: "https://yoa.st/shopify56",
		textPresenceCTAUrl: "https://yoa.st/shopify57",
		listsUrlTitle: "https://yoa.st/shopify38",
		listsCTAUrl: "https://yoa.st/shopify39",
	}  );
	worker.setCustomCornerstoneContentAssessorClass( ProductCornerstoneContentAssessor, "productPage", {
		subheadingUrlTitle: "https://yoa.st/shopify68",
		subheadingCTAUrl: "https://yoa.st/shopify69",
		paragraphUrlTitle: "https://yoa.st/shopify66",
		paragraphCTAUrl: "https://yoa.st/shopify67",
		sentenceLengthUrlTitle: "https://yoa.st/shopify48",
		sentenceLengthCTAUrl: "https://yoa.st/shopify49",
		transitionWordsUrlTitle: "https://yoa.st/shopify44",
		transitionWordsCTAUrl: "https://yoa.st/shopify45",
		passiveVoiceUrlTitle: "https://yoa.st/shopify42",
		passiveVoiceCTAUrl: "https://yoa.st/shopify43",
		textPresenceUrlTitle: "https://yoa.st/shopify56",
		textPresenceCTAUrl: "https://yoa.st/shopify57",
		listsUrlTitle: "https://yoa.st/shopify38",
		listsCTAUrl: "https://yoa.st/shopify39",
	}  );
	worker.setCustomRelatedKeywordAssessorClass( ProductRelatedKeywordAssessor, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
	}  );
	worker.setCustomCornerstoneRelatedKeywordAssessorClass( ProductCornerstoneRelatedKeywordAssessor, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
	}  );
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
