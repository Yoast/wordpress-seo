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
	const morphologyData = get( researcher.getData( "morphology" ), "nl", false );
	let stemmerNL = stemmer;

	if ( ! morphologyData ) {
		stemmerNL = word => word;
	}
	return getProminentWordsForInternalLinking( paper, researcher, stemmerNL, functionWords, morphologyData );
}
