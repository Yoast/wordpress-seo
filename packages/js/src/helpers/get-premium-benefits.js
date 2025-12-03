import { __ } from "@wordpress/i18n";

const condensedBenefits = [
	__( "Create optimized SEO titles & meta descriptions in seconds", "wordpress-seo" ),
	__( "Apply AI suggestions to improve content in 1 click", "wordpress-seo" ),
	__( "Manage redirects with ease and without extra plugins", "wordpress-seo" ),
	__( "Optimize pages for multiple keywords with guidance", "wordpress-seo" ),
];
const fullBenefits = [
	__( "Generate SEO optimized metadata in seconds with AI", "wordpress-seo" ),
	__( "Make your articles visible, be seen in Google News", "wordpress-seo" ),
	__( "Built to get found by search, AI, and real users", "wordpress-seo" ),
	__( "Easy Local SEO. Show up in Google Maps results", "wordpress-seo" ),
	__( "Internal links and redirect management, easy", "wordpress-seo" ),
	__( "Access to friendly help when you need it, day or night", "wordpress-seo" ),
];
/**
 * @returns {string[]} The premium benefits.
 */
export const getPremiumBenefits = ( condensed = false  ) => {
	return condensed ? condensedBenefits : fullBenefits;
};

export const getWooSeoBenefits = ( condensed = false ) => {
	if ( condensed ) {
		return condensedBenefits;
	}

	const wooSeoBenefits = [ ...fullBenefits ];
	wooSeoBenefits[ 1 ] = __( "Boost visibility for your products, from 10 or 10,000+", "wordpress-seo" );
	return wooSeoBenefits;
};

