/* eslint-disable complexity */
/**
 * Builds the source to send to the newsletter endpoint depending on which add-ons are active.
 *
 * @param {string} originalSource The original source string.
 * @param {boolean} isPremium Whether Premium is active.
 * @param {Array} addonsStatus A list of add-ons and whether they are active.
 * @returns {array} The source to send to the newsletter endpoint depending on which add-ons are active.
 */
export const buildNewsletterSource = ( originalSource, isPremium, addonsStatus ) => {
	const source = [ originalSource, "wordpress-seo" ];

	if ( isPremium ) {
		source.push( "wordpress-seo-premium" );
	}

	if ( addonsStatus?.isWooSeoActive ) {
		source.push( "wpseo-woocommerce" );
	}

	if ( addonsStatus?.isLocalSEOActive ) {
		source.push( "wpseo-local" );
	}

	if ( addonsStatus?.isVideoSEOActive ) {
		source.push( "wpseo-video" );
	}

	if ( addonsStatus?.isNewsSEOActive ) {
		source.push( "wpseo-news" );
	}

	if ( addonsStatus?.isDuplicatePostActive ) {
		source.push( "duplicate-post" );
	}

	return source;
};
