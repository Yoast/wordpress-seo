import matchWords from "../stringProcessing/matchTextWithArray";

/**
 * Counts the number of keyphrase matches,
 * where a match is defined as a set containing all keywords.
 *
 * (E.g. for keyphrase "key word match",
 * "key word match. key word. match. match." is counted as two matches: {"key","word","match"} x2 + one incomplete set {"match"}).
 */
const keyphraseMatchCount = function( description, keyphraseForms, locale ) {
	const keywordMatchCounts = keyphraseForms.map( keywordForms => matchWords( description, keywordForms, locale ).count );
	return Math.min( ...keywordMatchCounts );
};

/**
 * Matches the keyword in the description if a description and keyword are available.
 * Returns null if no description is specified in the given paper.
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher the researcher object to gather researchers from.
 * @returns { Object | null } The number of matches per keyword term, for the entire description and for each individual sentence.
 */
export default function( paper, researcher ) {
	if ( paper.getDescription() === "" ) {
		return null;
	}
	const description = paper.getDescription();
	const locale = paper.getLocale();

	const topicForms = researcher.getResearch( "morphology" );

	// Focus keyphrase matches.
	let matchesKeyphrase = keyphraseMatchCount( description, topicForms.keyphraseForms, locale );

	// Keyphrase synonyms matches.
	let matchesSynonyms = topicForms.synonymsForms.map(
		synonymForms => keyphraseMatchCount( description, synonymForms, locale )
	);

	// Total amount of matches (focus and synonyms).
	return matchesKeyphrase + matchesSynonyms.reduce( (sum, count) => sum + count, 0 );
}

