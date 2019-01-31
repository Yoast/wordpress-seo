import determineFacebookImageMode from "./determineFacebookImageMode";

/**
 * Gets the dimensions of the uploaded image.
 *
 * @param {string} src The image source.
 *
 * @returns {Object} The image original image dimensions.
 */
function getOriginalImageDimensions( src ) {
	return new Promise( (resolve, reject) => {
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

const squareWidth = 158;
const squareHeight = 158;
const portraitWidth = 158;
const portraitHeight = 236;
const landscapeWidth = 500;
const landscapeHeight = 261;


/**
 * Calculates the dimensions of the image to use as FacebookImage.
 *
 * @param {Object} originalDimensions The width and height of the original image.
 * @param {string} imageMode The image mode: square, portrait or landscape.
 *
 * @returns {object} The image dimensions for the facebook image.
 */
function calculateFacebookImageDimensions( originalDimensions, imageMode ) {
	let widthRatio;
	let heightRatio;

	// The width and height of the original uploaded image.
	const originalWidth = originalDimensions.width;
	const originalHeight = originalDimensions.height;

	console.log("hallo", originalWidth, originalHeight )

	/*
	 When it's a square, just use the squareWidth and squareHeight. We don't have to fear that the resulting image will
	 be warped.
	 */
	if ( imageMode === "square" ) {
		return {
			width: squareWidth,
			height: squareHeight,
		};
	}

	/*
	 When we're in portrait or landscape mode, we can't just resize to the dimensions expected by Facebook. If we'd do
	 so, we would end up with warped images.

	 First, we calculate the ratio between the original width and height and the width and height that is expected by
	 Facebook.

	 For example: the original image is 1600x898 and Facebook expects 500x261. The width ratio would be 3.44 and the
	 height ratio would be 3.2.
	 */
	if ( imageMode === "portrait" ) {
		widthRatio = originalWidth / portraitWidth;
		heightRatio = originalHeight / portraitHeight;
	}
	if ( imageMode === "landscape" ) {
		widthRatio = originalWidth / landscapeWidth;
		heightRatio = originalHeight / landscapeHeight;
	}

	/*
	 To use as much as the allowed space as possible, we base both dimensions on the dimension with the lowest ratio.

	 For example: for the 1600x898 image above, the height ratio is larger than the width ratio. The result of dividing by
	 the heightRatio is an 1600x280.625 image. The excess of 280.625-261 = 18.375 pixels will be 'cut off' by the container
	 in the presentation part.

	 If we would divide by the widthRatio, the image would become 465x261, which would mean it would not be wide enough for
	 the container which means there would be a 500-465=35px white border on one of the sides.
	 */
	if ( widthRatio <= heightRatio ) {
		return {
			width: originalWidth / widthRatio,
			height: originalHeight / widthRatio,
		};
	}

	if ( widthRatio > heightRatio ) {
		return {
			width: originalWidth / heightRatio,
			height: originalHeight / heightRatio,
		};
	}



	// todo: what about too small images?
}

/**
 * Determines the dimensions of the Facebook Image.
 *
 * @param {string} src The source of the image.
 *
 * @returns {object} The width and height of the image.
 */
export default function determineFacebookImageDimensions( src ) {
//	return new Promise( ( resolve, reject ) => {
	return getOriginalImageDimensions( src ).then( ( originalDimensions ) => {
		console.log("dimensions", originalDimensions )

		// Determine what image mode should be used based on the image dimensions.
		const imageMode = determineFacebookImageMode( originalDimensions.width, originalDimensions.height );

		// Calculate the image dimensions for the specific image.
		const facebookImageDimensions = calculateFacebookImageDimensions( originalDimensions, imageMode );
		return {
			mode: imageMode,
			height: facebookImageDimensions.height,
			width: facebookImageDimensions.width,
		}
		} );

}
