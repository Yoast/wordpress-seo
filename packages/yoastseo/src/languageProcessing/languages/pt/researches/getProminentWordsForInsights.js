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
	const morphologyData = get( researcher.getData( "morphology" ), "pt", false );
	let stemmerPT = stemmer;

	if ( ! morphologyData ) {
		stemmerPT = word => word;
	}
	return getProminentWordsForInsights( paper, researcher, stemmerPT, functionWords, morphologyData );
}
