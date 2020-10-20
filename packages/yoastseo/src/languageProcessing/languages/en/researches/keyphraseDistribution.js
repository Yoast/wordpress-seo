import { keyphraseDistributionResearcher } from "../../../researches/base/keyphraseDistribution";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @inheritDoc keyphraseDistributionResearcher
 */
export default function( paper, researcher ) {
	return keyphraseDistributionResearcher( paper, researcher, functionWords );
}
