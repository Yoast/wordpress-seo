export const SQUARE_WIDTH = 123;
export const SQUARE_HEIGHT = 123;
export const LANDSCAPE_WIDTH = 506;
export const LANDSCAPE_HEIGHT = 253;

/**
 * Determines the image display mode of the Twitter image.
 *
 * @param {Object} cardType The card type in which an image should be displayed.
 *
 * @returns {string} The display mode of the image.
 */
export function determineTwitterImageMode( cardType ) {
	if ( cardType === "summary" ) {
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
 * When we're landscape mode, we can't just resize to the dimensions expected by Twitter. If we'd do
 * so, we would end up with warped images. That's why we calculate the ratio between the original width and height and
 * the width and height that is expected by Twitter. For example: the original image is 898x1600 (height x width) and
 * Twitter expects 253x506. The heightRatio would be 3.55 (898/253) and the widthRatio would be 3.16 (1600/506).
 *
 * @param {Object} dimensions The dimensions of the original image.
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {Object} The image's width ratio and height ratio.}
 */
export function getImageRatios( dimensions, imageMode ) {
	if ( imageMode === "landscape" ) {
		return {
			widthRatio: dimensions.width / LANDSCAPE_WIDTH,
			heightRatio: dimensions.height / LANDSCAPE_HEIGHT,
		};
	}

	if ( imageMode === "square" ) {
		return {
			widthRatio: dimensions.width / SQUARE_WIDTH,
			heightRatio: dimensions.height / SQUARE_HEIGHT,
		};
	}
}

/**
 * Gets the image dimensions that the image should have as Twitter image.
 *
 * To use as much as the allowed space as possible, we base both dimensions on the dimension with the lowest imageRatio
 * (see above). For example: for a 898x1600 image, the heightRatio is larger than the widthRatio. The result of dividing
 * by the widthRatio is a 284x506 image. The excess of 284-253 = 31 pixels will be 'cut off' by the
 * container in the presentation part.
 *
 * If we would divide by the heightRatio, the image would become 253x451, which means it would not be wide enough for
 * the container, which means there would be a 506-451=55px white border on one of the sides.
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
 * @param {string} imageMode The image mode: square or landscape.
 *
 * @returns {object} The image dimensions for the Twitter image.
 */
export function calculateTwitterImageDimensions( originalDimensions, imageMode ) {
	// Images that are too small should not be scaled.
	if ( originalDimensions.width < SQUARE_WIDTH || originalDimensions.height < SQUARE_HEIGHT ) {
		return {
			width: originalDimensions.width,
			height: originalDimensions.height,
		};
	}

	/*
	 * If the image should be rendered as a square, and its original dimensions were also square,
	 * just use the squareWidth and squareHeight.
	 * We don't have to fear that the resulting image will be warped.
	 */
	if ( imageMode === "square" ) {
		if ( originalDimensions.width === originalDimensions.height ) {
			return {
				width: SQUARE_WIDTH,
				height: SQUARE_HEIGHT,
			};
		}

		/*
		 * If the image should be rendered as a square, but originally wasn't square,
		 * crop the longest side. This way, the image won't be warped.
		 */
		const imageRatios = getImageRatios( originalDimensions, imageMode );

		return getImageDimensionsForTwitterImage( originalDimensions, imageRatios );
	}

	/*
	 * If the image should be rendered as a landscape, crop the longest side,
	 * to reach the required size ratio. This way, the image won't be warped.
	 */
	if ( imageMode === "landscape" ) {
		const imageRatios = getImageRatios( originalDimensions, imageMode );

		return getImageDimensionsForTwitterImage( originalDimensions, imageRatios );
	}
}

/**
 * Determines the properties of the Twitter image.
 *
 * @param {string} src The source of the image.
 * @param {string} cardType The card type in which an image should be displayed.
 *
 * @returns {Promise} The promise of the imageProperties.
 */
export function determineTwitterImageProperties( src, cardType ) {
	return getOriginalImageDimensions( src ).then( ( originalDimensions ) => {
		// Determine what image mode should be used based on the card type.
		const imageMode = determineTwitterImageMode( cardType );

		// Calculate the image dimensions for the specific image.
		const TwitterImageDimensions = calculateTwitterImageDimensions( originalDimensions, imageMode );

		return {
			mode: imageMode,
			height: TwitterImageDimensions.height,
			width: TwitterImageDimensions.width,
		};
	} );
}
