import matchWords from "../stringProcessing/matchTextWithArray";

const replaceFoundKeywordForms = function( description, matchedKeywordForms ) {
	// Replace matches so we do not match them for synonyms.
	matchedKeywordForms.forEach( keywordForm =>
		keywordForm.matches.forEach(
			match => {
				description = description.replace( match, "" );
			}
		)
	);
	return description;
};

/**
 * Counts the number of full keyphrase matches in the description.
 * Returns -1 if no description is specified in the given paper.
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher the researcher object to gather researchers from.
 * @returns {Number} The number of keyphrase matches for the entire description.
 */
export default function( paper, researcher ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	let description = paper.getDescription();
	const locale = paper.getLocale();

	const topicForms = researcher.getResearch( "morphology" );

	// Focus keyphrase matches.
	let matchesKeyphrase = topicForms.keyphraseForms.map( keywordForms => matchWords( description, keywordForms, locale ) );

	// Replace matches so we do not match them for synonyms.
	description = replaceFoundKeywordForms( description, matchesKeyphrase );

	// Keyphrase synonyms matches.
	let matchesSynonyms = [];
	if ( topicForms.synonymsForms ) {
		matchesSynonyms = topicForms.synonymsForms.map(
			synonymForms => {
				let matches = synonymForms.map( keywordForms => matchWords( description, keywordForms, locale ) );
				// Replace matches so we do not match them for other synonyms.
				description = replaceFoundKeywordForms( description, matchesKeyphrase );
				return matches;
			}
		);
	}

	// Count the number of matches that contain every word in the entire keyphrase.
	const fullKeyphraseMatches = Math.min( ...matchesKeyphrase.map( match => match.count ) );
	const fullSynonymsMatches = matchesSynonyms.map(
		matchesSynonym => Math.min( ...matchesSynonym.map( match => match.count ) )
	);

	return [ fullKeyphraseMatches, ...fullSynonymsMatches ].reduce( ( sum, count ) => sum + count, 0 );
}

