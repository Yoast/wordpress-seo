import { get } from "lodash-es";
import getProminentWordsForInsights from "../../../researches/base/getProminentWordsForInsights";
import { determineStem as stemmer } from "../morphology/determineStem";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	const morphologyData = get( researcher.getData( "morphology" ), "en", false );
	let stemmerEN = stemmer;

	if ( ! morphologyData ) {
		stemmerEN = word => word;
	}
	return getProminentWordsForInsights( paper, researcher, stemmerEN, functionWords, morphologyData );
}
