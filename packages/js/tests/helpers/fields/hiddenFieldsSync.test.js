import { valuesToSync } from "../../../src/helpers/fields/hiddenFieldsSync";

import {
	getFocusKeyphrase,
	getNoIndex,
	getNoFollow,
	getAdvanced,
	getBreadcrumbsTitle,
	getCanonical,
	getWordProofTimestamp,
	getFacebookTitle,
	getFacebookDescription,
	getFacebookImageUrl,
	getFacebookImageId,
	getTwitterTitle,
	getTwitterDescription,
	getTwitterImageUrl,
	getTwitterImageId,
	getPageType,
	getArticleType,
	isCornerstoneContent,
	getReadabilityScore,
	getSeoScore,
	getInclusiveLanguageScore,
	getEstimatedReadingTime } from "../../../src/helpers/fields";

describe( "hiddenFieldsSync", () => {
	it( "should call createCollectorFromObject with the correct parameters", () => {
		expect( valuesToSync ).toMatchObject( {
			focuskw: getFocusKeyphrase,
			"meta-robots-noindex": getNoIndex,
			noindex: getNoIndex,
			"meta-robots-nofollow": getNoFollow,
			"meta-robots-adv": getAdvanced,
			bctitle: getBreadcrumbsTitle,
			canonical: getCanonical,
			wordproof_timestamp: getWordProofTimestamp,
			"opengraph-title": getFacebookTitle,
			"opengraph-description": getFacebookDescription,
			"opengraph-image": getFacebookImageUrl,
			"opengraph-image-id": getFacebookImageId,
			"twitter-title": getTwitterTitle,
			"twitter-description": getTwitterDescription,
			"twitter-image": getTwitterImageUrl,
			"twitter-image-id": getTwitterImageId,
			schema_page_type: getPageType,
			schema_article_type: getArticleType,
			is_cornerstone: isCornerstoneContent,
			content_score: getReadabilityScore,
			linkdex: getSeoScore,
			inclusive_language_score: getInclusiveLanguageScore,
			"estimated-reading-time-minutes": getEstimatedReadingTime,
		} );
	} );
} );
