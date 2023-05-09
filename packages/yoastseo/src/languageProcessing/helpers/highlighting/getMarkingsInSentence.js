import { flatten } from "lodash-es";
import Mark from "../../../../src/values/Mark";
import { getLanguage } from "../../../../src/languageProcessing";

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

/**
 * This function creates the old style marked sentence for search based highlighting.
 * Ideally this function becomes obsolete when position based highlighting is implemented everywhere.
 * @param {Sentence} sentence The sentence to which to apply the marks.
 * @param {Object} matches The matches to apply.
 * @returns {string} The sentence with marks applied.
 */
const createMarksForSentence = ( sentence, matches ) => {
	let sentenceText = sentence.text;

	// Create one array with both primary and secondary matches, sorted by start offset.
	let allMatches = flatten( matches.primaryMatches );
	if ( matches.primaryMatches.length > 0 ) {
		allMatches = allMatches.concat( flatten( matches.secondaryMatches ) ).sort( function( a, b ) {
			return a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset;
		} );
	}

	const sentenceStartOffset = sentence.sourceCodeRange.startOffset;
	// Loop through the matches backwards, so that the reference is not affected by the changes.
	for ( let i = allMatches.length - 1; i >= 0; i-- ) {
		const match = allMatches[ i ];

		// Apply the mark to the sentence.
		// sentenceStartOffset is subtracted because the start and end offsets are relative to the start of the source code.
		// Subtracting the sentenceStartOffset makes them relative to the start of the sentence.
		sentenceText = sentenceText.substring( 0, match.sourceCodeRange.endOffset - sentenceStartOffset ) + markEnd +
			sentenceText.substring( match.sourceCodeRange.endOffset - sentenceStartOffset );
		sentenceText = sentenceText.substring( 0, match.sourceCodeRange.startOffset - sentenceStartOffset ) + markStart +
			sentenceText.substring( match.sourceCodeRange.startOffset - sentenceStartOffset );
	}

	// Merge consecutive markings into one marking.
	sentenceText = sentenceText.replace( new RegExp( "</yoastmark>( ?)<yoastmark class='yoast-text-mark'>", "ig" ), "$1" );

	return sentenceText;
};

/**
 * Merges consecutive markings into one marking.
 * This is a helper for position based highlighting.
 *
 * @param {Mark[]} markings An array of markings to merge.
 * @param {boolean} useSpace Whether words are separated by a space. In Japanese, for example, words are not separated by a space.
 *
 * @returns {Mark[]} An array of markings where consecutive markings are merged.
 */
const mergeConsecutiveMarkings = ( markings, useSpace = true ) => {
	const newMarkings = [];

	/**
	 * The first iteration, newMarkings is empty, so the first marking is always added.
	 * After that, the newMarkings array is iterated over,
	 * and for each marking it is checked whether it is consecutive to any of the markings in the newMarkings array.
	 * If the newMarking and the current marking are consecutive, the current marking is merged into the newMarking.
	 * If the current marking precedes the newMarking, the start of the newMarking is set to the start of the current marking.
	 * The actionDone flag is set to false, such that the newMarking is not added to the newMarkings array.
	 * If the current marking succeeds the newMarking, the end of the newMarking is set to the end of the current marking.
	 * The actionDone flag is set to true, such that the newMarking is added to the newMarkings array.
	 * In the (theoretical and unlikely) edge case that the current marking is overlapping with the newMarking,
	 * the start of the newMarking is set to the minimum of the start of the newMarking and the current marking.
	 * The end of the newMarking is set to the maximum of the end of the newMarking and the current marking.
	 * The actionDone flag is set to true, such that the newMarking is added to the newMarkings array.
	 *
	 * If the actionDone flag is false, the current marking is added to the newMarkings array,
	 * because it is not found to be consecutive to any of the markings in the newMarkings array.
	 */

	markings.forEach( ( marking ) => {
		let actionDone = false;
		newMarkings.forEach( ( newMarking, newMarkingIndex ) => {
			// If the markings are consecutive, merge them.
			if ( newMarking.getPositionEnd() + ( useSpace ? 1 : 0 ) === marking.getPositionStart() ) {
				newMarkings[ newMarkingIndex ]._properties.position.endOffset = marking.getPositionEnd();
				actionDone = true;
				// if the markings are overlapping, merge them.
			} else if ( newMarking.getPositionEnd() >= marking.getPositionStart() && newMarking.getPositionStart() <= marking.getPositionEnd() ) {
				// eslint-disable-next-line max-len
				newMarkings[ newMarkingIndex ]._properties.position.startOffset = Math.min( newMarking.getPositionStart(), marking.getPositionStart() );
				newMarkings[ newMarkingIndex ]._properties.position.endOffset = Math.max( newMarking.getPositionEnd(), marking.getPositionEnd() );
				actionDone = true;
				// If the markings are consecutive, merge them.
			} else if ( newMarking.getPositionStart() === marking.getPositionEnd() + ( useSpace ? 1 : 0 ) ) {
				newMarkings[ newMarkingIndex ]._properties.position.startOffset = marking.getPositionStart();
				actionDone = true;
			}
		} );
		if ( ! actionDone ) {
			newMarkings.push( marking );
		}
	} );
	return newMarkings;
};


/**
 * Gets the Mark objects of all keyphrase matches.
 *
 * @param {Sentence} sentence The sentence to check.
 * @param {Object} matchesInSentence An object containing the matches in the sentence.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 * @param {string} locale The locale used in the analysis.
 *
 * @returns {Mark[]}    The array of Mark objects of the keyphrase matches.
 */
function getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper, locale ) {
	// Create the marked sentence that is used for search based highlighting.
	const markedSentence = createMarksForSentence( sentence, matchesInSentence );

	// Create the markings for the primary matches.
	// Note that there is a paradigm shift:
	// With search based highlighting there would be one marking for the entire sentence.
	// With Position based highlighting there is a marking for each match.
	// In order to be backwards compatible with search based highlighting,
	// all markings for a sentence have the same markedSentence.
	// ...
	const markings = matchesInSentence.primaryMatches.flatMap( match => {
		return  match.map( token => {
			return new Mark( {
				position: {
					startOffset: token.sourceCodeRange.startOffset,
					endOffset: token.sourceCodeRange.endOffset,
				},
				marked: markedSentence,
				original: sentence.text,
			} );
		} );
	} );

	// Only if there are primary matches, add the secondary matches.
	if ( matchesInSentence.primaryMatches.length > 0 ) {
		flatten( matchesInSentence.secondaryMatches ).forEach( match =>{
			markings.push( new Mark( {
				position: {
					startOffset: match.sourceCodeRange.startOffset,
					endOffset: match.sourceCodeRange.endOffset,
				},
				marked: markedSentence,
				original: sentence.text,

			} ) );
		}
		);
	}
	return mergeConsecutiveMarkings( markings, getLanguage( locale ) !== "ja" );
}

export default getMarkingsInSentence;
