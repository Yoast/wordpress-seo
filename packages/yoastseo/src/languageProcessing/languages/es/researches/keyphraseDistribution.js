import { keyphraseDistributionResearcher } from "../../../researches/base/keyphraseDistribution";

/**
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @inheritDoc keyphraseDistributionResearcher
 */
export default function( paper, researcher ) {
	return keyphraseDistributionResearcher( paper, researcher, true );
}
