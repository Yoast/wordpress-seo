import { get } from "lodash-es";
import getProminentWordsForInternalLinking from "../../../researches/base/getProminentWordsForInternalLinking";
import stemmer from "../morphology/stem";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "pl", false );
	let stemmerPL = stemmer;

	if ( ! morphologyData ) {
		stemmerPL = word => word;
	}
	return getProminentWordsForInternalLinking( paper, researcher, stemmerPL, functionWords, morphologyData );
}
