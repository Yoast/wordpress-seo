import { isFeatureEnabled } from "@yoast/feature-flag";
import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
// For now I imported the English stemmer so that some specs would be failing.
// Once the Farsi stemmer is implemented, this has to be changed to Farsi stemmer.
import determineStem from "../../en/helpers/internal/determineStem";
const { baseStemmer } = languageProcessing;

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	if ( isFeatureEnabled( "FARSI_SUPPORT" ) ) {
		const morphologyData = get( researcher.getData( "morphology" ), "fa", false );

		if ( morphologyData ) {
			return word => determineStem( word, morphologyData );
		}
		return baseStemmer;
	}

	return baseStemmer;
}
