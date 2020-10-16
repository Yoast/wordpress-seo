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
	const morphologyData = get( researcher.getData( "morphology" ), "es", false );
	let stemmerES = stemmer;

	if ( ! morphologyData ) {
		stemmerES = word => word;
	}
	return getProminentWordsForInsights( paper, researcher, stemmerES, functionWords, morphologyData );
}
