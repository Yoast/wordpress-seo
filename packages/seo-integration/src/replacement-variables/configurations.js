import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { SEO_STORE_NAME } from "@yoast/seo-store";

/**
 * Holds the replacement variable configurations, for use within the SEO store context.
 *
 * There are more replacement variables outside the SEO store context. For example:
 * @see [Available replacement variables in Yoast SEO for WordPress]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 */

export const content = {
	name: "content",
	getLabel: () => __( "Content", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectContent(),
};

export const date = {
	name: "date",
	getLabel: () => __( "Date", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectDate(),
};

export const excerpt = {
	name: "excerpt",
	getLabel: () => __( "Excerpt", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectExcerpt(),
};

export const excerptOnly = {
	name: "excerpt_only",
	getLabel: () => __( "Excerpt only", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectExcerpt(),
};

export const focusKeyphrase = {
	name: "focus_keyphrase",
	getLabel: () => __( "Focus keyphrase", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectKeyphrase(),
	regexp: new RegExp( "%%focuskw%%|%%keyword%%", "g" ),
};

export const permalink = {
	name: "permalink",
	getLabel: () => __( "Permalink", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectPermalink(),
};

export const title = {
	name: "title",
	getLabel: () => __( "Title", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectTitle(),
};
