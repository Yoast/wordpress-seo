/* eslint-disable camelcase */
import { hiddenFieldsSync } from "../../../src/helpers/fields/hiddenFieldsSync";
import { createWatcher, createCollectorFromObject } from "../../../src/helpers/create-watcher";
import { EDITOR_STORE, SYNC_TIME } from "../../../src/shared-admin/constants";
import { select, subscribe } from "@wordpress/data";
import { debounce } from "lodash";
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
	getEstimatedReadingTime,
} from "../../../src/helpers/fields";


jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	subscribe: jest.fn(),
} ) );

jest.mock( "lodash", () => ( {
	debounce: jest.fn(),
	get: jest.fn( ()=> {
		return { primary_category: "5" };
	} ),
	pickBy: jest.fn( () => [] ),
	forEach: jest.fn(),
	map: jest.fn(),
} ) );

jest.mock( "../../../src/helpers/create-watcher", () => ( {
	createWatcher: jest.fn(),
	createCollectorFromObject: jest.fn(),
} ) );

describe( "hiddenFieldsSync", () => {
	it( "should subscribe to changes and sync the right values", () => {
		select.mockImplementation( ( store ) => {
			if ( store === EDITOR_STORE ) {
				return {
					getFocusKeyphrase: jest.fn(),
					getNoIndex: jest.fn(),
					getNoFollow: jest.fn(),
					getAdvanced: jest.fn(),
					getBreadcrumbsTitle: jest.fn(),
					getCanonical: jest.fn(),
					getWordProofTimestamp: jest.fn(),
					getFacebookTitle: jest.fn(),
					getFacebookDescription: jest.fn(),
					getFacebookImageUrl: jest.fn(),
					getFacebookImageId: jest.fn(),
					getTwitterTitle: jest.fn(),
					getTwitterDescription: jest.fn(),
					getTwitterImageUrl: jest.fn(),
					getTwitterImageId: jest.fn(),
					getPageType: jest.fn(),
					getArticleType: jest.fn(),
					isCornerstoneContent: jest.fn(),
					getReadabilityResults: jest.fn( () => {
						return { overallScore: 5 };
					} ),
					getSeoResults: jest.fn( () => {
						return { overallScore: 5 };
					} ),
					getInclusiveLanguageResults: jest.fn( () => {
						return { overallScore: 5 };
					} ),
					getEstimatedReadingTime: jest.fn(),
				};
			}
		} );

		// Call the hiddenFieldsSync function
		hiddenFieldsSync();

		// Assertions
		// expect( subscribe ).toHaveBeenCalledWith( expect.any( Function ), EDITOR_STORE );
		// expect( debounce ).toHaveBeenCalledWith( expect.any( Function ), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } );
		// expect( select ).toHaveBeenCalledWith( EDITOR_STORE );
		// expect( createWatcher ).toHaveBeenCalledWith( expect.any( Function ), expect.any( Function ) );
		expect( createCollectorFromObject ).toHaveBeenCalledWith( {
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
