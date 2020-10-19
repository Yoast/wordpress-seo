import { get } from "lodash-es";
import getProminentWordsForInternalLinking from "../../../researches/base/getProminentWordsForInternalLinking";
import { determineStem as stemmer } from "../morphology/determineStem";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Retrieves the prominent words from the given paper.
 *
 * @inheritDoc getProminentWordsForInternalLinking
 */
export default function( paper, researcher ) {
	// Assign the stemmer to identity function for when there is no available morphology data file.
	// eslint-disable-next-line require-jsdoc
	let stemmerDE = word => word;
	const morphologyData = get( researcher.getData( "morphology" ), "de", false );

	if ( morphologyData ) {
		stemmerDE = stemmer;
	}
	return getProminentWordsForInternalLinking( paper, researcher, stemmerDE, functionWords, morphologyData );
}
