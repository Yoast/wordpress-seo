import { get } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;
import createWordForms from "./internal/createWordForms";

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
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
