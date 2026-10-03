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
		/* Translators: %1$s expands to the jpg format, %2$s expands to the png format,
		%3$s expands to the webp format, %4$s expands to the gif format. */
		__(
			"No image was found that we can automatically set as your social image. Please use %1$s, %2$s, %3$s or %4$s formats to ensure it displays correctly on social media.",
			"wordpress-seo"
		),
		"JPG", "PNG", "WEBP", "GIF"
	);
	useEffect( () => {
		setHasFallbackWarning( imageUrl === "" ? imageFallbackUrl.toLowerCase().endsWith( ".avif" ) : false );
	}, [ imageFallbackUrl, imageUrl ] );
	return hasFallbackWarning ? [ warningMessage ] : imageWarnings;
};
