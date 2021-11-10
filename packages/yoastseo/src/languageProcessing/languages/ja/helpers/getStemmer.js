import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;
import createWordForms from "./internal/createWordForms";

/**
 * Returns a function to create word forms in Japanese when the morphologyData is available. Otherwise returns baseStemmer.
 *
 * @param {Researcher} researcher    The Japanese researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "ja", false );

	if ( morphologyData ) {
		return word => createWordForms( word, morphologyData );
	}

	return baseStemmer;
}
