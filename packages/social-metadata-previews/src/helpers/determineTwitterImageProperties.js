export const SUMMARY_WIDTH = 123.422;
export const SUMMARY_HEIGHT = 123.422;
export const SUMMARY_LARGE_IMAGE_WIDTH = 506;
export const SUMMARY_LARGE_IMAGE_HEIGHT = 254;

/**
 * Determines the image display mode of the Twitter image.
 *
 * @param {Object} dimensions The image's dimensions.
 *
 * @returns {string} The display mode of the image.
 */
export function determineTwitterImageMode( dimensions ) {
	if ( dimensions.height === dimensions.width ) {
		return "summary";
	}

	return "summary_large_image";
}

/**
 * Gets the dimensions of the uploaded image.
 *
 * @param {string} src The image source.
 *
 * @returns {Object} The image original image dimensions.
 */
export function getOriginalImageDimensions( src ) {
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
 * Gets the ratios of the width and height of the original image in relation to the width and height
 * of the expected image.
 *
 * When we're summary_large_image mode, we can't just resize to the dimensions expected by Twitter. If we'd do
 * so, we would end up with warped images. That's why we calculate the ratio between the original width and height and
 * the width and height that is expected by Twitter. For example: the original image is 1600x898 and Twitter expects
 * 500x261. The width ratio would be 3.44 and the height ratio would be 3.2.
 *
 * @param {Object} dimensions The dimensions of the original image.
 *
 * @returns {Object} The image's width ratio and height ratio.
 */
export function getImageRatios( dimensions ) {
	return {
		widthRatio: dimensions.width / SUMMARY_LARGE_IMAGE_WIDTH,
		heightRatio: dimensions.height / SUMMARY_LARGE_IMAGE_HEIGHT,
	};
}

/**
 * Gets the image dimensions that the image should have as Twitter image.
 *
 * To use as much as the allowed space as possible, we base both dimensions on the dimension with the lowest imageRatio
 * (see above). For example: for a 1600x898 image, the height ratio is larger than the width ratio. The result of dividing
 * by the heightRatio is an 1600x280.625 image. The excess of 280.625-261 = 18.375 pixels will be 'cut off' by the
 * container in the presentation part.
 *
 * If we would divide by the widthRatio, the image would become 465x261, which would mean it would not be wide enough for
 * the container which means there would be a 500-465=35px white border on one of the sides.
 *
 * @param {Object} dimensions  The dimensions of the original image.
 * @param {Object} imageRatios The ratios of the width and height of the original image in relation to the width and
 *                             height of the expected image.
 *
 * @returns {Object}           The width and height that the image should have as Twitter image.
 */
export function getImageDimensionsForTwitterImage( dimensions, imageRatios ) {
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
 * Calculates the dimensions of the image to use as TwitterImage.
 *
 * @param {Object} originalDimensions The width and height of the original image.
 * @param {string} imageMode The image mode: summary or summary_large_image.
 *
 * @returns {object} The image dimensions for the Twitter image.
 */
export function calculateTwitterImageDimensions( originalDimensions, imageMode ) {
	// Images that are too small should not be scaled.
	if ( originalDimensions.width < SUMMARY_WIDTH || originalDimensions.height < SUMMARY_HEIGHT ) {
		return {
			width: originalDimensions.width,
			height: originalDimensions.height,
		};
	}

	/*
	 * If the image is a summary, just use the summaryWidth and summaryHeight. We
	 * don't have to fear that the resulting image will be warped.
	 */
	if ( imageMode === "summary" ) {
		return {
			width: SUMMARY_WIDTH,
			height: SUMMARY_HEIGHT,
		};
	}

	/*
	 * If the image isn't a summary (and thus, it is a summary_large_image), calculate the image ratios.
	 */
	const imageRatios = getImageRatios( originalDimensions );

	return getImageDimensionsForTwitterImage( originalDimensions, imageRatios );
}

/**
 * Determines the properties of the Twitter image.
 *
 * @param {string} src The source of the image.
 *
 * @returns {Promise} The promise of the imageProperties.
 */
export function determineTwitterImageProperties( src ) {
	return getOriginalImageDimensions( src ).then( ( originalDimensions ) => {

		// Determine what image mode should be used based on the image dimensions.
		const imageMode = determineTwitterImageMode( originalDimensions );

		// Calculate the image dimensions for the specific image.
		const TwitterImageDimensions = calculateTwitterImageDimensions( originalDimensions, imageMode );

		return {
			mode: imageMode,
			height: TwitterImageDimensions.height,
			width: TwitterImageDimensions.width,
		};
	} );
}
