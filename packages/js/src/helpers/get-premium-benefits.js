import { __ } from "@wordpress/i18n";

/**
 * @returns {string[]} The premium benefits.
 */
export const getPremiumBenefits = () => [
	`<strong>${ __( "AI", "wordpress-seo" ) }:</strong> ${ __( "Better SEO titles and meta descriptions, faster", "wordpress-seo" ) }`,
	`<strong>${ __( "Multiple keywords", "wordpress-seo" ) }:</strong> ${ __( "Rank higher for more searches", "wordpress-seo" ) }`,
	`<strong>${ __( "Super fast", "wordpress-seo" ) }</strong> ${ __( "internal linking suggestions", "wordpress-seo" ) }`,
	`<strong>${ __( "No more broken links", "wordpress-seo" ) }:</strong> ${ __( "Automatic redirect manager", "wordpress-seo" ) }`,
	`<strong>${ __( "Appealing social previews", "wordpress-seo" ) }</strong> ${ __( "people actually want to click on", "wordpress-seo" ) }`,
	`<strong>${ __( "24/7 support", "wordpress-seo" ) }:</strong> ${ __( "Also on evenings and weekends", "wordpress-seo" ) }`,
];
