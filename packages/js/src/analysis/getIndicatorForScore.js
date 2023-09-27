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
				/* translators: Hidden accessibility text. */
				screenReaderText: __( "Feedback", "wordpress-seo" ),
				screenReaderReadabilityText: "",
				screenReaderInclusiveLanguageText: "",
			};
		case "bad":
			return {
				className: "bad",
				/* translators: Hidden accessibility text. */
				screenReaderText: __( "Needs improvement", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
				screenReaderReadabilityText: __( "Needs improvement", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
				screenReaderInclusiveLanguageText: __( "Needs improvement", "wordpress-seo" ),
			};
		case "ok":
			return {
				className: "ok",
				/* translators: Hidden accessibility text. */
				screenReaderText: __( "OK SEO score", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
				screenReaderReadabilityText: __( "OK", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
				screenReaderInclusiveLanguageText: __( "Potentially non-inclusive", "wordpress-seo" ),
			};
		case "good":
			return {
				className: "good",
				/* translators: Hidden accessibility text. */
				screenReaderText: __( "Good SEO score", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
				screenReaderReadabilityText: __( "Good", "wordpress-seo" ),
				/* translators: Hidden accessibility text. */
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
