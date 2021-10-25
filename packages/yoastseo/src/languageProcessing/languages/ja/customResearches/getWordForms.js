//get all the words from a paper
//get all the words in a text
//create wordforms for a keyphrase
// find matches in the paper
//return an object with an array of matched forms of keyphrases and synonyms
// {
// *                     keyphraseForms: [[ form1, form2, ... ], [ form1, form2, ... ]],
// *                     synonymsForms: [
// *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
// *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
// *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
// *                     ],
// *
//}

import { collectStems, StemOriginalPair } from "../../../helpers/morphology/buildTopicStems";
import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getWords from "../helpers/getWords";
import getContentWords from "../helpers/getContentWords";
import createWordForms from "../helpers/internal/createWordForms";
/**
 * Gets all matching word forms for the keyphrase and synonyms. Stems are either collected from
 * the paper or, for specific languages, directly created.
 *
 * @param {string}          keyphrase               The keyphrase.
 * @param {string[]}        synonyms                The synonyms.
 * @param {string[]}        allWordsFromPaper       All words found in the paper.
 * @param {string[]}        functionWords           The function words for a given language (if available).
 * @param {Function|null}   stemmer                 A stemmer (if available).
 * @param {Function|null}   createBasicWordForms    A function to create basic word forms (if available).

 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
function getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, createWordForms, createBasicWordForms ) {
	const topicPhrases     = collectStems( keyphrase, synonyms, createWordForms, functionWords );
	const keyphraseForms = topicPhrases.keyphraseForms;
	const synonymsForms  = topicPhrases.synonymsForms;

	// Return an empty result when no keyphrase and synonyms have been set.
	if ( keyphraseForms.stemOriginalPairs.length === 0 && synonymsForms.length === 0 ) {
		return new Result();
	}

	// Return exact match if all topic phrases contain exact match. Forms don't need to be built in that case.
	const allTopicPhrases = [ keyphraseForms, ...synonymsForms ];

	if ( allTopicPhrases.every( topicPhrase => topicPhrase.exactMatch === true ) ) {
		return new Result(
			[ [ keyphraseForms.stemOriginalPairs[ 0 ].stem ] ],
			synonymsForms.map( synonym => [ [ synonym.stemOriginalPairs[ 0 ].stem ] ]
			)
		);
	}

	// Get all stems from the keyphrase and synonyms.
	const topicStemsFlat = uniq( extractStems( keyphraseForms, synonymsForms ) );

	/*
	 * Get all words from the paper text, title, meta description and slug.
	 * Filter duplicates and function words.
	 */
	const paperWords = uniq( allWordsFromPaper.filter( word => ! functionWords.includes( word ) ) );

	// Add stems to words from the paper, filter out all forms that aren't in the keyphrase or synonyms and order alphabetically.
	const paperWordsWithStems = paperWords
		.map( word => new StemOriginalPair( stemmer( word ), word ) )
		.filter( stemOriginalPair => topicStemsFlat.includes( stemOriginalPair.stem ) )
		.sort( ( a, b ) => a.stem.localeCompare( b.stem ) );

	// Group word-stem pairs from the paper by stems.
	const paperWordsGroupedByStems = paperWordsWithStems.reduce( function( accumulator, stemOriginalPair ) {
		const lastItem = accumulator[ accumulator.length - 1 ];

		if ( accumulator.length === 0 || lastItem.stem !== stemOriginalPair.stem ) {
			accumulator.push( new StemWithForms( stemOriginalPair.stem, [ stemOriginalPair.original ] ) );
		} else {
			lastItem.forms.push( stemOriginalPair.original );
		}

		return accumulator;
	}, [] );

	return new Result(
		constructTopicPhraseResult( keyphraseForms, paperWordsGroupedByStems, createBasicWordForms ),
		synonymsForms.map( synonym => constructTopicPhraseResult( synonym, paperWordsGroupedByStems, createBasicWordForms ) )
	);
}

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	const stemmer = researcher.getHelper( "getStemmer" )( researcher );
	const createBasicWordForms = researcher.getHelper( "createBasicWordForms" );
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase( "ja" ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "ja" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "ja" ).trim() );

	return getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, stemmer, createBasicWordForms );
}
