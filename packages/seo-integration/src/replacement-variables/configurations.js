import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { strings as stringHelpers } from "@yoast/helpers";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { excerptFromContent } from "@yoast/wordpress-seo/src/helpers/replacementVariableHelpers";

/**
 * Holds the replacement variable configurations, for use within the SEO store context.
 *
 * There are more replacement variables outside the SEO store context. For example:
 * @see [Available replacement variables in Yoast SEO for WordPress]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 */

export const content = {
	name: "content",
	getLabel: () => __( "Content", "wordpress-seo" ),
	getReplacement: () => stringHelpers.stripHTMLTags( select( SEO_STORE_NAME ).selectContent() ),
};

export const date = {
	name: "date",
	getLabel: () => __( "Date", "wordpress-seo" ),
	getReplacement: () => new Date( select( SEO_STORE_NAME ).selectDate() ).toLocaleDateString(
		// eslint-disable-next-line no-undefined
		undefined,
		{
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	),
};

export const excerpt = {
	name: "excerpt",
	getLabel: () => __( "Excerpt", "wordpress-seo" ),
	getReplacement: () => {
		const currentContent = select( SEO_STORE_NAME ).selectContent();

		// Limit the excerpt to 80 characters for Japanese and to 156 characters for other languages.
		const currentLocale = select( SEO_STORE_NAME ).selectLocale();
		const limit = currentLocale === "ja" ? 80 : 156;

		return excerptFromContent( currentContent, limit );
	},
};

export const excerptOnly = {
	name: "excerpt_only",
	getLabel: () => __( "Excerpt only", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectExcerpt(),
};

export const focusKeyphrase = {
	name: "focuskw",
	getLabel: () => __( "Focus keyphrase", "wordpress-seo" ),
	getReplacement: () => select( SEO_STORE_NAME ).selectKeyphrase(),
	regexp: new RegExp( "%%focuskw%%|%%keyword%%|%%focus_keyphrase%%", "g" ),
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
