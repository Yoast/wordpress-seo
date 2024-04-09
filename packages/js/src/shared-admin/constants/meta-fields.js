export const META_FIELDS = {
	focusKeyphrase: {
		key: "focuskw",
		get: "getFocusKeyphrase",
		set: "setFocusKeyword",
	},
	robotsNoIndex: {
		key: "meta-robots-noindex",
		get: "getNoIndex",
		set: "setNoIndex",
	},
	robotsNoFollow: {
		key: "meta-robots-nofollow",
		get: "getNoFollow",
		set: "setNoFollow",
	},
	robotsAdvanced: {
		key: "meta-robots-adv",
		get: "getAdvanced",
		set: "setAdvanced",
	},
	facebookTitle: {
		key: "opengraph-title",
		get: "getFacebookTitle",
		set: "setFacebookPreviewTitle",
	},
	facebookDescription: {
		key: "opengraph-description",
		get: "getFacebookDescription",
		set: "setFacebookPreviewDescription",
	},
	facebookImageUrl: {
		key: "opengraph-image",
		get: "getFacebookImageUrl",
		set: "setFacebookPreviewImage",
	},
	facebookImageId: {
		key: "opengraph-image-id",
		get: "getFacebookImageId",
		set: "setFacebookPreviewImage",
	},
	twitterTitle: {
		key: "twitter-title",
		get: "getTwitterTitle",
		set: "setTwitterPreviewTitle",
	},
	twitterDescription: {
		key: "twitter-description",
		get: "getTwitterDescription",
		set: "setTwitterPreviewDescription",
	},
	twitterImageUrl: {
		key: "twitter-image",
		get: "getTwitterImageUrl",
		set: "setTwitterPreviewImage",
	},
	twitterImageId: {
		key: "twitter-image-id",
		get: "getTwitterImageId",
		set: "setTwitterPreviewImage",
	},
	schemaPageType: {
		key: "schema_page_type",
		get: "getPageType",
		set: "setPageType",
	},
	schemaArticleType: {
		key: "schema_article_type",
		get: "getArticleType",
		set: "setArticleType",
	},
	isCornerstone: {
		key: "is_cornerstone",
		get: "isCornerstoneContent",
		set: "setCornerstoneContent",
	},
	readabilityScore: {
		key: "content_score",
		get: "getReadabilityScore",
		set: "setOverallReadabilityScore",
	},
	seoScore: {
		key: "linkdex",
		get: "getScoreForFocusKeyword",
		set: "setOverallSeoScore",
	},
	inclusiveLanguageScore: {
		key: "inclusive_language_score",
		get: "getInclusiveLanguageScore",
		set: "setOverallInclusiveLanguageScore",
	},
	breadcrumbsTitle: {
		key: "bctitle",
		get: "getBreadcrumbsTitle",
		set: "setBreadcrumbsTitle",
	},
	canonical: {
		key: "canonical",
		get: "getCanonical",
		set: "setCanonical",
	},
	wordProofTimestamp: {
		key: "wordproof_timestamp",
		get: "getWordProofTimestamp",
		set: "setWordProofTimestamp",
	},
	seoTitle: {
		key: "title",
		get: "getSnippetEditorTitle",
		set: "updateData",
	},
	seoDescription: {
		key: "metadesc",
		get: "getSnippetEditorDescription",
		set: "updateData",
	},
	readingTime: {
		key: "estimated-reading-time-minutes",
		get: "getEstimatedReadingTime",
		set: "setEstimatedReadingTime",
	},
};

export const HIDDEN_INPUT_ID_PREFIX = {
	post: "yoast_wpseo_",
	term: "hidden_wpseo_",
};

export const POST_META_KEY_PREFIX = `_${ HIDDEN_INPUT_ID_PREFIX.post }`;
