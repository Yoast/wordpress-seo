export const TWITTER_IMAGE_SIZES = {
	squareWidth: 125,
	squareHeight: 125,
	landscapeWidth: 506,
	landscapeHeight: 265,
	aspectRatio: ( 0.502 / 1 ) * 100,
};

export const FACEBOOK_IMAGE_SIZES = {
	squareWidth: 158,
	squareHeight: 158,
	landscapeWidth: 527,
	landscapeHeight: 273,
	portraitWidth: 158,
	portraitHeight: 237,
	aspectRatio: ( 0.522 / 1 ) * 100,
};

/**
 * Determines the image display mode for Facebook images, given its dimensions.
 *
 * @param {Object} originalDimensions The dimensions of the original image.
 *
 * @returns {string} The display mode of the image.
 */
export function determineFacebookImageMode( originalDimensions ) {
	const largeThreshold = { height: 233, width: 446 };

	if ( originalDimensions.height < largeThreshold.height || originalDimensions.width < largeThreshold.width ) {
		return "square";
	}

	if ( originalDimensions.height === originalDimensions.width ) {
		return "square";
	}

	if ( originalDimensions.height > originalDimensions.width ) {
		return "portrait";
	}

	return "landscape";
}

/**
 * Retrieves the image sizes.
 *
 * @param {string} socialMedium Facebook or Twitter.
 *
 * @returns {Object} Object containing the image sizes.
 */
export function retrieveExpectedDimensions( socialMedium ) {
	if ( socialMedium === "Twitter" ) {
		return TWITTER_IMAGE_SIZES;
	}

	return FACEBOOK_IMAGE_SIZES;
}

/**
 * Gets the dimensions of the uploaded image.
 *
 * @param {string} src The image source.
 *
 * @returns {Object} The original image dimensions.
 */
function retrieveOriginalImageDimensions( src ) {
	/* istanbul ignore next */
	return new Promise( ( resolve, reject ) => {
		const img = new Image();

		img.onload = () => {
			resolve( {
				width: img.width,
				height: img.height,
			} );
		};

		img.onerror = reject;

		img.src = src;
	} );
}

/**
 * Calculates the ratios of the width and height of the original image in relation to the width and
 * height of the expected image.
 *
 * When we're in landscape mode, we can't just resize to the dimensions expected by Twitter or Facebook.
 * If we'd do so, we would end up with warped images. That's why we calculate the ratio between
 * the original height, and the height that is expected by Twitter or Facebook.
 * We do the same thing for width.
 * For example: an original image is 898x1600 (height x width) and Twitter expects 254x506.
 * The heightRatio would be 3.53 (898/254) and the widthRatio would be 3.16 (1600/506).
 *
 * @param {Object} expectedDimensions The dimensions of images in the social medium.
 * @param {Object} originalDimensions The dimensions of the original image.
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {Object} The image's width ratio and height ratio.
 */
export function calculateImageRatios( expectedDimensions, originalDimensions, imageMode ) {
	if ( imageMode === "landscape" ) {
		return {
			widthRatio: originalDimensions.width / expectedDimensions.landscapeWidth,
			heightRatio: originalDimensions.height / expectedDimensions.landscapeHeight,
		};
	}

	if ( imageMode === "portrait" ) {
		return {
			widthRatio: originalDimensions.width / expectedDimensions.portraitWidth,
			heightRatio: originalDimensions.height / expectedDimensions.portraitHeight,
		};
	}

	// By default, the image mode is square.
	return {
		widthRatio: originalDimensions.width / expectedDimensions.squareWidth,
		heightRatio: originalDimensions.height / expectedDimensions.squareHeight,
	};
}

/**
 * Calculates the largest dimensions that can be used for rendering the image.
 *
 * To use as much as the allowed space as possible, we base both dimensions on the dimension with
 * the lowest imageRatio. For example: for a 898x1600 image, the heightRatio is larger than the
 * widthRatio (see above). The result of dividing by the widthRatio is a 284x506 image.
 * The excess of 284-254 = 30 pixels will be 'cut off' by the container in the presentation part.
 *
 * If we would divide by the heightRatio, the image would become 254x451, which means it would not
 * be wide enough for the container: there would be a 506-451=55px white border on one of the sides.
 *
 * @param {Object} originalDimensions The dimensions of the original image.
 * @param {Object} imageRatios The ratios of the width and height of the original image in relation
 *                             to the width and height of the expected image.
 *
 * @returns {Object} The width and height that the image should have as Twitter/Facebook image.
 */
export function calculateLargestDimensions( originalDimensions, imageRatios ) {
	if ( imageRatios.widthRatio <= imageRatios.heightRatio ) {
		return {
			width: Math.round( originalDimensions.width / imageRatios.widthRatio ),
			height: Math.round( originalDimensions.height / imageRatios.widthRatio ),
		};
	}

	return {
		width: Math.round( originalDimensions.width / imageRatios.heightRatio ),
		height: Math.round( originalDimensions.height / imageRatios.heightRatio ),
	};
}

/**
 * Calculates the dimensions of the image to use as Twitter/Facebook image.
 *
 * @param {Object} expectedDimensions The dimensions of images in the social medium.
 * @param {Object} originalDimensions The dimensions of the original image.
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {object} The image dimensions.
 */
export function calculateImageDimensions( expectedDimensions, originalDimensions, imageMode ) {
	/*
	 * If the image should be rendered as a square, and its original dimensions were also square,
	 * just use the squareWidth and squareHeight required by the social medium.
	 * We don't have to fear that the resulting image will be warped.
	 */
	if ( imageMode === "square" ) {
		if ( originalDimensions.width === originalDimensions.height ) {
			return {
				width: expectedDimensions.squareWidth,
				height: expectedDimensions.squareHeight,
			};
		}

		/*
		 * If the (Twitter) image should be rendered as a square, but originally wasn't square, crop the
		 * longest side. This way, the image won't be warped.
		 */
		const imageRatiosSquare = calculateImageRatios( expectedDimensions, originalDimensions, imageMode );

		return calculateLargestDimensions( originalDimensions, imageRatiosSquare );
	}

	/*
	 * If the image should be rendered as a landscape or portrait, crop the longest side, to reach
	 * the required size ratio. This way, the image won't be warped.
	 */
	const imageRatiosNonSquare = calculateImageRatios( expectedDimensions, originalDimensions, imageMode );

	return calculateLargestDimensions( originalDimensions, imageRatiosNonSquare );
}

/**
 * Determines the properties of the image.
 *
 * @param {string}  src            The source of the image.
 * @param {string}  socialMedium   Facebook or Twitter.
 * @param {Boolean} twitterIsLarge Whether twitter is the summary_card_large or not.
 *                                 False by default, because we don't want to pass this for Facebook.
 *
 * @returns {Promise} The promise of the imageProperties.
 */
export async function determineImageProperties( src, socialMedium, twitterIsLarge = false ) {
	const originalDimensions = await retrieveOriginalImageDimensions( src );

	// Determine what image mode should be used.

	// First, set it correctly for Twitter
	let imageMode = twitterIsLarge ? "landscape" : "square";

	// Override if we need the Facebook image mode.
	if ( socialMedium === "Facebook" ) {
		imageMode = determineFacebookImageMode( originalDimensions );
	}

	// Retrieve the image sizes, depending on the social medium.
	const expectedDimensions = retrieveExpectedDimensions( socialMedium );

	// Calculate the image dimensions for the specific image.
	const imageDimensions = calculateImageDimensions( expectedDimensions, originalDimensions, imageMode );

	return {
		mode: imageMode,
		height: imageDimensions.height,
		width: imageDimensions.width,
	};
}

/**
 * Wraps the determined image properties in a neat object.
 *
 * @param {String}  src          The image URL.
 * @param {String}  socialMedium Twitter or Facebook.
 * @param {Boolean} twitterIsLarge Whether twitter is the summary_card_large or not.
 *                                 False by default, because we don't want to pass this for Facebook.
 *
 * @returns {Object} An object the Image components can handle.
 */
export async function handleImage( src, socialMedium, twitterIsLarge = false ) {
	try {
		const imageProperties = await determineImageProperties( src, socialMedium, twitterIsLarge );
		return {
			imageProperties: imageProperties,
			status: "loaded",
		};
	} catch ( error ) {
		return {
			imageProperties: null,
			status: "errored",
		};
	}
}
