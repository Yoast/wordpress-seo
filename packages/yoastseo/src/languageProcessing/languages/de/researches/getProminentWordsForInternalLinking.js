import { get } from "lodash-es";
import getProminentWordsForInternalLinking from "../../../researches/base/getProminentWordsForInternalLinking";
import { determineStem as stemmer } from "../morphology/determineStem";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "de", false );
	let stemmerDE = stemmer;

	if ( ! morphologyData ) {
		stemmerDE = null;
	}
	return getProminentWordsForInternalLinking( paper, researcher, stemmerDE, functionWords, morphologyData );
}
