import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

import stem from "./internal/stem";

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "sk", false );

	if ( morphologyData ) {
		return word => stem( word, morphologyData );
	}

	return baseStemmer;
}
