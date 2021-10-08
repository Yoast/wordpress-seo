import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
import stem from "./internal/stem";
const { baseStemmer } = languageProcessing;

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "el", false );

	if ( morphologyData ) {
		return word => stem( word, morphologyData );
	}

	return baseStemmer;
}
