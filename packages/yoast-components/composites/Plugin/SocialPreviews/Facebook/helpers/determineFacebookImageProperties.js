export const SQUARE_WIDTH = 158;
export const SQUARE_HEIGHT = 158;
export const PORTRAIT_WIDTH = 158;
export const PORTRAIT_HEIGHT = 236;
export const LANDSCAPE_WIDTH = 500;
export const LANDSCAPE_HEIGHT = 261;

/**
 * Determines the image display mode of the Facebook Image.
 *
 * @param {Object} dimensions The image's dimensions.
 *
 * @returns {string} The display mode of the image.
 */
export function determineFacebookImageMode( dimensions ) {
	if ( dimensions.height > dimensions.width ) {
		return "portrait";
	}

	if ( dimensions.height === dimensions.width ) {
		return "square";
	}

	return "landscape";
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
 * When we're in portrait or landscape mode, we can't just resize to the dimensions expected by Facebook. If we'd do
 * so, we would end up with warped images. That's why we calculate the ratio between the original width and height and
 * the width and height that is expected by Facebook. For example: the original image is 1600x898 and Facebook expects
 * 500x261. The width ratio would be 3.44 and the height ratio would be 3.2.
 *
 * @param {Object} dimensions The dimensions of the original image.
 * @param {string} imageMode The image mode: either portrait or landscape.
 *
 * @returns {Object} The image's width ratio and height ratio.
 */
export function getImageRatios( dimensions, imageMode ) {
	if ( imageMode === "portrait" ) {
		return {
			widthRatio: dimensions.width / PORTRAIT_WIDTH,
			heightRatio: dimensions.height / PORTRAIT_HEIGHT,
		};
	}
	if ( imageMode === "landscape" ) {
		return {
			widthRatio: dimensions.width / LANDSCAPE_WIDTH,
			heightRatio: dimensions.height / LANDSCAPE_HEIGHT,
		};
	}
}

/**
 * Gets the image dimensions that the image should have as Facebook image.
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
 * @returns {Object}           The width and height that the image should have as Facebook image.
 */
export function getImageDimensionsForFacebookImage( dimensions, imageRatios ) {
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
 * Calculates the dimensions of the image to use as FacebookImage.
 *
 * @param {Object} originalDimensions The width and height of the original image.
 * @param {string} imageMode The image mode: square, portrait or landscape.
 *
 * @returns {object} The image dimensions for the Facebook image.
 */
export function calculateFacebookImageDimensions( originalDimensions, imageMode ) {
	// Images that are too small should not be scaled.
	if ( originalDimensions.width < 158 || originalDimensions.height < 158 ) {
		return {
			width: originalDimensions.width,
			height: originalDimensions.height,
		};
	}

	/*
	 * If the image is a square, just use the squareWidth and squareHeight. We
	 * don't have to fear that the resulting image will be warped.
	 */
	if ( imageMode === "square" ) {
		return {
			width: SQUARE_WIDTH,
			height: SQUARE_HEIGHT,
		};
	}

	const imageRatios = getImageRatios( originalDimensions, imageMode );

	return getImageDimensionsForFacebookImage( originalDimensions, imageRatios );
}

/**
 * Determines the properties of the Facebook Image.
 *
 * @param {string} src The source of the image.
 *
 * @returns {Promise} The promise of the imageProperties.
 */
export function determineFacebookImageProperties( src ) {
	return getOriginalImageDimensions( src ).then( ( originalDimensions ) => {
		// Determine what image mode should be used based on the image dimensions.
		const imageMode = determineFacebookImageMode( originalDimensions );

		// Calculate the image dimensions for the specific image.
		const facebookImageDimensions = calculateFacebookImageDimensions( originalDimensions, imageMode );
		return {
			mode: imageMode,
			height: facebookImageDimensions.height,
			width: facebookImageDimensions.width,
		};
	} );
}
