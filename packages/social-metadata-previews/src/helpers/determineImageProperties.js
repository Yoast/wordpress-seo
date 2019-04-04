export const TWITTER_IMAGE_SIZES = {
	"squareWidth": 123,
	"squareHeight": 123,
	"landscapeWidth": 506,
	"landscapeHeight": 253
};

export const FACEBOOK_IMAGE_SIZES = {
	"squareWidth": 158,
	"squareHeight": 158,
	"landscapeWidth": 500,
	"landscapeHeight": 261,
	"portraitWidth": 158,
	"portraitHeight": 236
};

/**
 * Determines the image display mode.
 *
 * @param {string} socialMedium Facebook or Twitter.
 * @param {Object} dimensions The image's dimensions.
 *
 * @returns {string} The display mode of the image.
 */
export function determineImageMode( socialMedium, dimensions ) {
	if ( socialMedium === "Facebook" ) {
		if ( dimensions.height > dimensions.width ) {
			return "portrait";
		}

		if ( dimensions.height === dimensions.width ) {
			return "square";
		}

		return "landscape";
	}

	if ( socialMedium === "Twitter" ) {
		if ( dimensions.height > 157 && dimensions.width > 300 ) {
			return "landscape";
		}

		return "square";
	}
}

/**
 * Retrieves the image sizes.
 *
 * @param {string} socialMedium Facebook or Twitter.
 *
 * @returns {Object} Object containing the image sizes.
 */
export function retrieveImageSizes ( socialMedium ) {
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
export function retrieveOriginalImageDimensions( src ) {
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
 * When we're in landscape mode, we can't just resize to the dimensions expected by Twitter.
 * If we'd do so, we would end up with warped images. That's why we calculate the ratio between
 * the original width and height and the width and height that is expected by Twitter.
 * For example: the original image is 898x1600 (height x width) and Twitter expects 253x506.
 * The heightRatio would be 3.55 (898/253) and the widthRatio would be 3.16 (1600/506).
 *
 * @param {Object} imageSizes The sizes of images in the social medium.
 * @param {Object} dimensions The dimensions of the original image.
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {Object} The image's width ratio and height ratio.}
 */
export function calculateImageRatios( imageSizes, dimensions, imageMode ) {

	if ( imageMode === "landscape" ) {
		return {
			widthRatio: dimensions.width / imageSizes.landscapeWidth,
			heightRatio: dimensions.height / imageSizes.landscapeHeight,
		};
	}

	if ( imageMode === "portrait" ) {
		return {
			widthRatio: dimensions.width / imageSizes.portraitWidth,
			heightRatio: dimensions.height / imageSizes.portraitHeight,
		};
	}

	if ( imageMode === "square" ) {
		return {
			widthRatio: dimensions.width / imageSizes.squareWidth,
			heightRatio: dimensions.height / imageSizes.squareHeight,
		};
	}
}

/**
 * Calculates the largest dimensions that can be used for rendering the image.
 *
 * To use as much as the allowed space as possible, we base both dimensions on the dimension with
 * the lowest imageRatio (see above). For example: for a 898x1600 image, the heightRatio is larger
 * than the widthRatio. The result of dividing by the widthRatio is a 284x506 image.
 * The excess of 284-253 = 31 pixels will be 'cut off' by the container in the presentation part.
 *
 * If we would divide by the heightRatio, the image would become 253x451, which means it would not
 * be wide enough for the container, which means there would be a 506-451=55px white border on one
 * of the sides.
 *
 * @param {Object} dimensions  The dimensions of the original image.
 * @param {Object} imageRatios The ratios of the width and height of the original image in relation
 *                             to the width and height of the expected image.
 *
 * @returns {Object}           The width and height that the image should have as Twitter/Facebook
 *                             image.
 */
export function calculateLargestDimensions( dimensions, imageRatios ) {
	if ( imageRatios.widthRatio <= imageRatios.heightRatio ) {
		return {
			width: dimensions.width / imageRatios.widthRatio,
			height: dimensions.height / imageRatios.widthRatio,
		};
	}

	return {
		width: dimensions.width / imageRatios.heightRatio,
		height: dimensions.height / imageRatios.heightRatio,
	};
}

/**
 * Calculates the dimensions of the image to use as Twitter/Facebook image.
 *
 * @param {Object} imageSizes The sizes of images in the social medium.
 * @param {Object} originalDimensions The width and height of the original image.
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {object} The image dimensions.
 */
export function calculateImageDimensions( imageSizes, originalDimensions, imageMode ) {
	// Images that are too small should not be scaled.
	if ( originalDimensions.width < imageSizes.squareWidth ||
		 originalDimensions.height < imageSizes.squareHeight ) {
		return {
			width: originalDimensions.width,
			height: originalDimensions.height,
		};
	}

	/*
	 * If the image should be rendered as a square, and its original dimensions were also square,
	 * just use the squareWidth and squareHeight. We don't have to fear that the resulting image
	 * will be warped.
	 */
	if ( imageMode === "square" ) {
		if ( originalDimensions.width === originalDimensions.height ) {
			return {
				width: imageSizes.squareWidth,
				height: imageSizes.squareHeight,
			};
		}

		/*
		 * If the image should be rendered as a square, but originally wasn't square, crop the
		 * longest side. This way, the image won't be warped.
		 */
		const imageRatios = calculateImageRatios( imageSizes, originalDimensions, imageMode );

		return calculateLargestDimensions( originalDimensions, imageRatios );
	}

	/*
	 * If the image should be rendered as a landscape or portrait, crop the longest side, to reach
	 * the required size ratio. This way, the image won't be warped.
	 */
	if ( imageMode === "landscape" || imageMode === "portrait") {
		const imageRatios = calculateImageRatios( imageSizes, originalDimensions, imageMode );

		return calculateLargestDimensions( originalDimensions, imageRatios );
	}
}

/**
 * Determines the properties of the image.
 *
 * @param {string} src The source of the image.
 * @param {string} socialMedium Facebook or Twitter.
 *
 * @returns {Promise} The promise of the imageProperties.
 */
export function determineImageProperties( src, socialMedium ) {
	return retrieveOriginalImageDimensions( src ).then( ( originalDimensions ) => {
		// Determine what image mode should be used.
		const imageMode = determineImageMode( socialMedium, originalDimensions );

		// Retrieve the image sizes, depending on the social medium.
		const imageSizes = retrieveImageSizes( socialMedium );

		// Calculate the image dimensions for the specific image.
		const ImageDimensions = calculateImageDimensions( imageSizes, originalDimensions, imageMode );

		return {
			mode: imageMode,
			height: ImageDimensions.height,
			width: ImageDimensions.width,
		};
	} );
}
