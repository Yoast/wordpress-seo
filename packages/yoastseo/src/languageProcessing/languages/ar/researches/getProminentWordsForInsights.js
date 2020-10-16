import { get } from "lodash-es";
import getProminentWordsForInsights from "../../../researches/base/getProminentWordsForInsights";
import stemmer from "../morphology/stem";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "ar", false );
	let stemmerAR = stemmer;

	if ( ! morphologyData ) {
		stemmerAR = word => word;
	}
	return getProminentWordsForInsights( paper, researcher, stemmerAR, functionWords, morphologyData );
}
