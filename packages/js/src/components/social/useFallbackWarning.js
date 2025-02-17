import { useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Checks if the fallback image is in AVIF format and sets a warning message.
 *
 * @param {string} imageFallbackUrl The fallback image URL.
 * @param {string} imageUrl The image URL.
 * @param {array} imageWarnings The image warnings.
 *
 * @returns {string[]} An array of warnings.
 */
export const useFallbackWarning = ( imageFallbackUrl, imageUrl, imageWarnings ) => {
	const [ hasFallbackWarning, setHasFallbackWarning ] = useState( false );
	const warningMessage = sprintf(
		/* Translators: %s expands to the jpg format, %s expands to the png format, %s expands to the webp format, %s expands to the gif format. */
		__(
			"No image was found that we can automatically set as your social image. Please use %s, %s, %s or %s formats to ensure it displays correctly on social media.",
			"wordpress-seo"
		),
		"JPG", "PNG", "WEBP", "GIF"
	);
	useEffect( () => {
		setHasFallbackWarning( imageUrl === "" ? imageFallbackUrl.toLowerCase().endsWith( ".avif" ) : false );
	}, [ imageFallbackUrl, imageUrl ] );
	return hasFallbackWarning ? [ warningMessage ] : imageWarnings;
};
