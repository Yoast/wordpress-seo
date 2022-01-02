import * as dom from "./helpers/dom";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-integration";
import isSeoAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isReadabilityAnalysisActive from "../analysis/isContentAnalysisActive";

/**
 * Gets the initial state for SEO store from post DOM.
 *
 * @returns {Object} The initial state.
 */
export const getInitialPostState = () => ( {
	analysis: {
		config: {
			analysisType: "post",
			isSeoActive: isSeoAnalysisActive(),
			isReadabilityActive: isReadabilityAnalysisActive(),
		},
	},
	editor: {
		title: dom.getPostTitle(),
		date: dom.getPostDate(),
		permalink: dom.getPostPermalink(),
		excerpt: dom.getPostExcerpt(),
		content: dom.getPostContent(),
		featuredImage: {
			url: dom.getPostFeaturedImageUrl(),
		},
	},
	form: {
		seo: {
			title: dom.getPostSeoTitle(),
			description: dom.getPostMetaDescription(),
			slug: dom.getPostSlug(),
			isCornerstone: dom.getPostIsCornerstone(),
		},
		keyphrases: {
			[ FOCUS_KEYPHRASE_ID ]: {
				id: FOCUS_KEYPHRASE_ID,
				keyphrase: dom.getPostFocusKeyphrase(),
			},
		},
	},
} );

/**
 * Gets the initial state for SEO store from term DOM.
 *
 * @returns {Object} The initial state.
 */
export const getInitialTermState = () => ( {
	analysis: {
		config: {
			analysisType: "term",
			isSeoActive: isSeoAnalysisActive(),
			isReadabilityActive: isReadabilityAnalysisActive(),
		},
	},
	editor: {
		title: dom.getTermName(),
		permalink: dom.getTermPermalink(),
		content: dom.getTermDescription(),
	},
	form: {
		seo: {
			title: dom.getTermSeoTitle(),
			description: dom.getTermMetaDescription(),
			slug: dom.getTermSlug(),
			isCornerstone: dom.getTermIsCornerstone(),
		},
		keyphrases: {
			[ FOCUS_KEYPHRASE_ID ]: {
				id: FOCUS_KEYPHRASE_ID,
				keyphrase: dom.getTermFocusKeyphrase(),
			},
		},
	},
} );
