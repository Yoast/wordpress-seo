import { get } from "lodash";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

import determineStem from "./internal/stem";

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "nb", false );

	if ( morphologyData ) {
		return word => determineStem( word, morphologyData );
	}

	return baseStemmer;
}
