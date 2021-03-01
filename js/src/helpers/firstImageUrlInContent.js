import { languageProcessing } from "yoastseo";

/**
 * Returns the URL of the first image found in the content.
 *
 * @param {string} content The content to search in.
 *
 * @returns {string} The URL of the first image or an empty string.
 */
export default function firstImageUrlInContent( content ) {
	const images = languageProcessing.imageInText( content );
	let image = "";

	if ( images.length === 0 ) {
		return "";
	}

	do {
		let currentImage = images.shift();
		currentImage = jQuery( currentImage );

		const imageSource = currentImage.prop( "src" );

		if ( imageSource ) {
			image = imageSource;
		}
	} while ( "" === image && images.length > 0 );

	return image;
}
