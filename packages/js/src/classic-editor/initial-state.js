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
			shouldApplyCornerstoneAnalysis: dom.getPostIsCornerstone(),
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
			tags: dom.getPostTags(),
			customTaxonomies: dom.getCustomTaxonomies(),
		},
		locale: getContentLocale(),
	},
	form: {
		seo: {
			title: dom.getPostSeoTitle() ||
				window.wpseoScriptData.metabox.title_template_no_fallback ||
				window.wpseoScriptData.metabox.title_template,
			description: dom.getPostMetaDescription() || window.wpseoScriptData.metabox.metadesc_template,
			slug: dom.getPostSlug(),
		},
		keyphrases: {
			[ FOCUS_KEYPHRASE_ID ]: {
				id: FOCUS_KEYPHRASE_ID,
				keyphrase: dom.getPostFocusKeyphrase(),
			},
		},
		social: {
			facebook: {
				title: dom.getPostFacebookTitle(),
				description: dom.getPostFacebookDescription(),
				image: {
					id: dom.getPostFacebookImageID(),
					url: dom.getPostFacebookImageUrl(),
				},
			},
			twitter: {
				title: dom.getPostTwitterTitle(),
				description: dom.getPostTwitterDescription(),
				image: {
					id: dom.getPostTwitterImageID(),
					url: dom.getPostTwitterImageUrl(),
				},
			},
			template: {
				description: window.wpseoScriptData.metabox.social_description_template,
				title: window.wpseoScriptData.metabox.social_title_template,
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
			useTaxonomy: true,
			isSeoActive: isSeoAnalysisActive(),
			isReadabilityActive: isReadabilityAnalysisActive(),
			shouldApplyCornerstoneAnalysis: dom.getTermIsCornerstone(),
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
			title: dom.getTermSeoTitle() ||
				window.wpseoScriptData.metabox.title_template_no_fallback ||
				window.wpseoScriptData.metabox.title_template,
			description: dom.getTermMetaDescription() || window.wpseoScriptData.metabox.metadesc_template,
			slug: dom.getTermSlug(),
		},
		keyphrases: {
			[ FOCUS_KEYPHRASE_ID ]: {
				id: FOCUS_KEYPHRASE_ID,
				keyphrase: dom.getTermFocusKeyphrase() || dom.getTermName(),
			},
		},
		social: {
			facebook: {
				title: dom.getTermFacebookTitle(),
				description: dom.getTermFacebookDescription(),
				image: {
					id: dom.getTermFacebookImageID(),
					url: dom.getTermFacebookImageUrl(),
				},
			},
			twitter: {
				title: dom.getTermTwitterTitle(),
				description: dom.getTermTwitterDescription(),
				image: {
					id: dom.getTermTwitterImageID(),
					url: dom.getTermTwitterImageUrl(),
				},
			},
			template: {
				description: window.wpseoScriptData.metabox.social_description_template,
				title: window.wpseoScriptData.metabox.social_title_template,
			},
		},
	},
} );
