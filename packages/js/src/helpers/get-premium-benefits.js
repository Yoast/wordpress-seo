import { __, sprintf } from "@wordpress/i18n";

/**
 * @returns {string[]} The premium benefits.
 */
export const getPremiumBenefits = () => [
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$sAI%2$s: Better SEO titles and meta descriptions, faster.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$sMultiple keywords%2$s: Rank higher for more searches.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$sSuper fast%2$s internal linking suggestions.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$sNo more broken links%2$s: Automatic redirect manager.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$sAppealing social previews%2$s people actually want to click on.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
	sprintf(
		/* translators: %1$s expands to a strong opening tag, %2$s expands to a strong closing tag. */
		__( "%1$s24/7 support%2$s: Also on evenings and weekends.", "wordpress-seo" ),
		"<strong>",
		"</strong>"
	),
];
