import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Checks if the fallback image is in AVIF format and sets a warning message.
 *
 * @param {string} imageFallbackUrl
 * @param {string} imageUrl
 * @param {array} imageWarnings
 *
 * @returns {void}
 */
export const useFallbackWarning = ( imageFallbackUrl, imageUrl, imageWarnings ) => {
	useEffect(() => {
		if ( imageFallbackUrl.toLowerCase().endsWith( ".avif" ) && imageUrl === "" ) {
			const warningMessage = sprintf(
				/* Translators: %s expands to the jpg format, %s expands to the png format, %s expands to the gif format. */
				__(
					"The image automatically added from your content is in an unsupported format. Supported formats are %s, %s, %s and %s. Please select or upload an image in a supported format to ensure it displays correctly on social media.",
					"wordpress-seo"
				),
				"JPG", "PNG", "WEBP", "GIF"
			);
			imageWarnings.length = 0;
			imageWarnings.push( warningMessage );
		} else {
			imageWarnings.length = 0;
		}
	}, [ imageFallbackUrl, imageUrl ] );
};
