import { __ } from "@wordpress/i18n";
import { interpreters } from "yoastseo";
import { isNil } from "lodash";

/**
 * Gets a score indicator for a given rating.
 *
 * @param {string} rating The rating.
 *
 * @returns {Object} The score indicator for the given rating.
 */
function getIndicatorForRating( rating ) {
	switch ( rating ) {
		case "feedback":
			return {
				className: "na",
				screenReaderText: __( "Not available", "wordpress-seo" ),
				screenReaderReadabilityText: __( "Not available", "wordpress-seo" ),
				screenReaderInclusiveLanguageText: __( "Not available", "wordpress-seo" ),
			};
		case "bad":
			return {
				className: "bad",
				screenReaderText: __( "Needs improvement", "wordpress-seo" ),
				screenReaderReadabilityText: __( "Needs improvement", "wordpress-seo" ),
				screenReaderInclusiveLanguageText: __( "Needs improvement", "wordpress-seo" ),
			};
		case "ok":
			return {
				className: "ok",
				screenReaderText: __( "OK SEO score", "wordpress-seo" ),
				screenReaderReadabilityText: __( "OK", "wordpress-seo" ),
				screenReaderInclusiveLanguageText: __( "Potentially non-inclusive", "wordpress-seo" ),
			};
		case "good":
			return {
				className: "good",
				screenReaderText: __( "Good SEO score", "wordpress-seo" ),
				screenReaderReadabilityText: __( "Good", "wordpress-seo" ),
				screenReaderInclusiveLanguageText: __( "Good", "wordpress-seo" ),
			};
		default:
			return {
				className: "loading",
				screenReaderText: "",
				screenReaderReadabilityText: "",
				screenReaderInclusiveLanguageText: "",
			};
	}
}

/**
 * Gets an indicator for a given total score.
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
export default function getIndicatorForScore( score ) {
	if ( ! isNil( score ) ) {
		// Scale because scoreToRating works from 0 to 10.
		score /= 10;
	}
	return getIndicatorForRating( interpreters.scoreToRating( score ) );
}
