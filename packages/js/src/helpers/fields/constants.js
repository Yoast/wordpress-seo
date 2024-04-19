export const META_KEYS = {
	focusKeyphrase: "focuskw",
	robotsNoIndex: "meta-robots-noindex",
	robotsNoFollow: "meta-robots-nofollow",
	robotsAdvanced: "meta-robots-adv",
	facebookTitle: "opengraph-title",
	facebookDescription: "opengraph-description",
	facebookImageUrl: "opengraph-image",
	facebookImageId: "opengraph-image-id",
	twitterTitle: "twitter-title",
	twitterDescription: "twitter-description",
	twitterImageUrl: "twitter-image",
	twitterImageId: "twitter-image-id",
	schemaPageType: "schema_page_type",
	schemaArticleType: "schema_article_type",
	isCornerstone: "is_cornerstone",
	readabilityScore: "content_score",
	seoScore: "linkdex",
	inclusiveLanguageScore: "inclusive_language_score",
	breadcrumbsTitle: "bctitle",
	canonical: "canonical",
	wordProofTimestamp: "wordproof_timestamp",
	seoTitle: "title",
	seoDescription: "metadesc",
	readingTime: "estimated-reading-time-minutes",
};

export const HIDDEN_INPUT_ID_PREFIX = {
	post: "yoast_wpseo_",
	term: "hidden_wpseo_",
};

export const POST_META_KEY_PREFIX = `_${ HIDDEN_INPUT_ID_PREFIX.post }`;

export const SYNC_TIME = {
	wait: 500,
	max: 1500,
};
