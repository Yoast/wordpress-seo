import getKeywordDensity from "../../../researches/base/getKeywordDensity";

/**
 * Calculates the keyword density and returns the information whether a stemmer is available or not.
 *
 * @inheritDoc getKeywordDensity
 */
export default function( paper, researcher ) {
	return getKeywordDensity( paper, researcher, false );
}
