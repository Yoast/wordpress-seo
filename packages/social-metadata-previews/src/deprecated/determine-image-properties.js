import { createObjectWrapper, logOnce } from "./deprecation-helpers";

const twitterImageSizes = {
	squareWidth: 125,
	squareHeight: 125,
	landscapeWidth: 506,
	landscapeHeight: 265,
	aspectRatio: ( 0.502 / 1 ) * 100,
};

/**
 * @deprecated 2.0.0
 */
export const TWITTER_IMAGE_SIZES = createObjectWrapper(
	twitterImageSizes,
	( scope, key ) => logOnce(
		`@yoast/social-metadata-previews/TWITTER_IMAGE_SIZES/${ scope }/${ key }`,
		`[@yoast/social-metadata-previews] "TWITTER_IMAGE_SIZES.${ key }" is deprecated and will be removed in the future, ` +
		"please use this from @yoast/social-metadata-forms instead.",
	),
);

const facebookImageSizes = {
	squareWidth: 158,
	squareHeight: 158,
	landscapeWidth: 527,
	landscapeHeight: 273,
	portraitWidth: 158,
	portraitHeight: 237,
	aspectRatio: ( 0.522 / 1 ) * 100,
	largeThreshold: { width: 446, height: 233 },
};

/**
 * @deprecated 2.0.0
 */
export const FACEBOOK_IMAGE_SIZES = createObjectWrapper(
	facebookImageSizes,
	( scope, key ) => logOnce(
		`@yoast/social-metadata-previews/FACEBOOK_IMAGE_SIZES/${ scope }/${ key }`,
		`[@yoast/social-metadata-previews] "FACEBOOK_IMAGE_SIZES.${ key }" is deprecated and will be removed in the future, ` +
		"please use this from @yoast/social-metadata-forms instead.",
	),
);

/**
 * Determines the image display mode for Facebook images, given its dimensions.
 *
 * @deprecated 2.0.0
 *
 * @param {Object} originalDimensions The dimensions of the original image.
 *
 * @returns {string} The display mode of the image.
 */
export function determineFacebookImageMode( originalDimensions ) {
	logOnce(
		"@yoast/social-metadata-previews/determineFacebookImageMode",
		"[@yoast/social-metadata-previews] 'determineFacebookImageMode' is deprecated and will be removed in the future, " +
		"please use this from @yoast/social-metadata-forms instead.",
	);

	const { largeThreshold } = FACEBOOK_IMAGE_SIZES;

	if ( originalDimensions.height > originalDimensions.width ) {
		return "portrait";
	}

	if ( originalDimensions.width < largeThreshold.width || originalDimensions.height < largeThreshold.height ) {
		return "square";
	}

	if ( originalDimensions.height === originalDimensions.width ) {
		return "square";
	}

	return "landscape";
}
