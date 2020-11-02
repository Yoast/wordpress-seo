import keyphraseLength from "../../../researches/base/keyphraseLength";

/**
 * Returns the length of the keyphrase and whether the language has function words available or not.
 *
 * @inheritDoc keyphraseLength
 */
export default function( paper, researcher ) {
	return keyphraseLength( paper, researcher, false );
}
