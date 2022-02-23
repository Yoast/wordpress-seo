import * as dom from "./helpers/dom";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-integration";
import isSeoAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isReadabilityAnalysisActive from "../analysis/isContentAnalysisActive";
import getContentLocale from "../analysis/getContentLocale";

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
		featuredImage: dom.getPostFeaturedImage(),
		taxonomies: {
			categories: dom.getPostCategories(),
		},
		locale: getContentLocale(),
	},
	form: {
		seo: {
			title: dom.getPostSeoTitle() || window.wpseoScriptData.metabox.title_template,
			description: dom.getPostMetaDescription() || window.wpseoScriptData.metabox.metadesc_template,
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
		locale: getContentLocale(),
	},
	form: {
		seo: {
			title: dom.getTermSeoTitle() || window.wpseoScriptData.metabox.title_template,
			description: dom.getTermMetaDescription() || window.wpseoScriptData.metabox.metadesc_template,
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
