/* eslint-disable complexity */
/**
 * Builds the source to send to the newsletter endpoint depending on which add-ons are active.
 *
 * @param {string} originalSource The original source string.
 * @param {boolean} isPremium Whether Premium is active.
 * @param {Array} activeAddons A list of add-ons and whether they are active.
 * @returns {array} The source to send to the newsletter endpoint depending on which add-ons are active.
 */
export const buildNewsletterSource = ( originalSource, isPremium, activeAddons ) => {
	const source = [ originalSource, "wordpress-seo" ];

	if ( isPremium ) {
		source.push( "wordpress-seo-premium" );
	}

	if ( activeAddons?.isWooSeoActive ) {
		source.push( "wpseo-woocommerce" );
	}

	if ( activeAddons?.isLocalSEOActive ) {
		source.push( "wpseo-local" );
	}

	if ( activeAddons?.isVideoSEOActive ) {
		source.push( "wpseo-video" );
	}

	if ( activeAddons?.isNewsSEOActive ) {
		source.push( "wpseo-news" );
	}

	if ( activeAddons?.isDuplicatePostActive ) {
		source.push( "duplicate-post" );
	}

	return source;
};
