import getProminentWordsForInsights from "../../../researches/base/getProminentWordsForInsights";

/**
 * Retrieves the prominent words from the given paper.
 *
 * @inheritDoc getProminentWordsForInsights
 */
export default function( paper, researcher ) {
	return getProminentWordsForInsights( paper, researcher,  word => word, [], null );
}
