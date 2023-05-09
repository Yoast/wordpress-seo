import { flatten } from "lodash-es";
import Mark from "../../../../src/values/Mark";
import { getLanguage } from "../../../../src/languageProcessing";

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

/**
 * Merges consecutive and overlapping markings into one marking.
 * This is a helper for position based highlighting.
 * @param {Object[]} matches An array of markings to merge.
 * @param {Boolean} useSpace Whether words are separated by a space. In Japanese, for example, words are not separated by a space.
 * @returns {Mark[]} An array of markings where consecutive and overlapping markings are merged.
 */
const mergeConsecutiveAndOverlappingMatches = ( matches, useSpace = true ) => {
	const newMatches = [];

	// Sort matches by start offset. This is probably redundant, but for extra safety.
	matches.sort( function( a, b ) {
		return a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset;
	} );

	matches.forEach( ( match ) => {
		if ( newMatches.length === 0 ) {
			newMatches.push( match );
			return;
		}

		const lastMatch = newMatches[ newMatches.length - 1 ];
		if ( lastMatch.sourceCodeRange.endOffset + ( useSpace ? 1 : 0 ) === match.sourceCodeRange.startOffset ) {
			lastMatch.sourceCodeRange.endOffset = match.sourceCodeRange.endOffset;
		} else if ( match.sourceCodeRange.startOffset <= lastMatch.sourceCodeRange.endOffset ) {
			// The match overlaps with the last match, so we extend the last match to include the new match.
			lastMatch.sourceCodeRange.endOffset = match.sourceCodeRange.endOffset;
		} else {
			newMatches.push( match );
		}
	} );

	return newMatches;
};

/**
 * This function creates the old style marked sentence for search based highlighting.
 * Ideally this function becomes obsolete when position based highlighting is implemented everywhere.
 * @param {Sentence} sentence The sentence to which to apply the marks.
 * @param {Object} matches The matches to apply.
 * @param {string} locale The locale of the text.
 * @returns {string} The sentence with marks applied.
 */
const createMarksForSentence = ( sentence, matches, locale ) => {
	let sentenceText = sentence.text;

	// Create one array with both primary and secondary matches, sorted by start offset.
	let allMatches = flatten( matches.primaryMatches );
	if ( matches.primaryMatches.length > 0 ) {
		allMatches = allMatches.concat( flatten( matches.secondaryMatches ) ).sort( function( a, b ) {
			return a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset;
		} );
	}

	// Merge consecutive and overlapping matches.
	allMatches = mergeConsecutiveAndOverlappingMatches( allMatches, getLanguage( locale ) !== "ja" );

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
 * Merges consecutive and overlapping markings into one marking.
 * This is a helper for position based highlighting.
 * @param {Mark[]} markings An array of markings to merge.
 * @param {Boolean} useSpace Whether words are separated by a space. In Japanese, for example, words are not separated by a space.
 * @returns {Mark[]} An array of markings where consecutive and overlapping markings are merged.
 */
const mergeConsecutiveAndOverlappingMarkings = ( markings, useSpace = true ) => {
	const newMarkings = [];

	// Sort markings by start offset. This is probably redundant, but for extra safety.
	markings.sort( function( a, b ) {
		return a.getPositionStart() - b.getPositionStart();
	} );

	markings.forEach( ( marking ) => {
		if ( newMarkings.length === 0 ) {
			newMarkings.push( marking );
			return;
		}

		const lastMarking = newMarkings[ newMarkings.length - 1 ];
		if ( lastMarking.getPositionEnd() + ( useSpace ? 1 : 0 ) === marking.getPositionStart() ) {
			// The marking is consecutive to the last marking, so we extend the last marking to include the new marking.
			lastMarking.setPositionEnd( marking.getPositionEnd() );
		} else if ( marking.getPositionStart() <= lastMarking.getPositionEnd() ) {
			// The marking overlaps with the last marking, so we extend the last marking to include the new marking.
			lastMarking.setPositionEnd( marking.getPositionEnd() );
		} else {
			// The marking is not consecutive to the last marking, so we add it to the array by itself.
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
	const markedSentence = createMarksForSentence( sentence, matchesInSentence, locale );

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
	return mergeConsecutiveAndOverlappingMarkings( markings, getLanguage( locale ) !== "ja" );
}

export default getMarkingsInSentence;
