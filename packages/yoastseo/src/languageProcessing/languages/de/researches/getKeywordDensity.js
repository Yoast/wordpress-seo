import getKeywordDensity from "../../../researches/base/getKeywordDensity";

/**
 * Calculates the keyword density.
 *
 * @inheritDoc getKeywordDensity
 */
export default function( paper, researcher ) {
	return getKeywordDensity( paper, researcher, true );
}
