import { get } from "lodash-es";
import baseStemmer from "../../../helpers/morphology/baseStemmer";
import stem from "./internal/stem";


/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "en", false );

	if ( morphologyData ) {
		return word => stem( word, morphologyData );
	}

	return baseStemmer;
}
