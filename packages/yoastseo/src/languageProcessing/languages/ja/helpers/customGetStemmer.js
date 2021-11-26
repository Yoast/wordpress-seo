import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;
import determineStem from "./internal/determineStem";

/**
 * Returns the stemmer for a researcher. This helper is currently only used for Prominent Words functionality.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "ja", false );

	if ( morphologyData ) {
		return word => determineStem( word, morphologyData );
	}

	return baseStemmer;
}
