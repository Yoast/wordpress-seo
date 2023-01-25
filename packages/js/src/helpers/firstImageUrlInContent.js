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

	if ( images.length === 0 ) {
		return "";
	}

	const imageElements = jQuery.parseHTML( images.join( "" ) );

	for ( const imageElement of imageElements ) {
		if ( imageElement.src ) {
			return imageElement.src;
		}
	}

	return "";
}
