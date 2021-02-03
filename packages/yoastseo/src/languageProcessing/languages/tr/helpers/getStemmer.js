import { get } from "lodash-es";
import baseStemmer from "../../../helpers/morphology/baseStemmer";
import determineStem from "./internal/stem";

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer( researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "tr", false );

	if ( morphologyData ) {
		return word => determineStem( word, morphologyData );
	}

	return baseStemmer;
}
