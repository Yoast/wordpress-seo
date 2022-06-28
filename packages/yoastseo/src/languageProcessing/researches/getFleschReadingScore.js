/** @module analyses/calculateFleschReading */

import stripNumbers from "../helpers/sanitize/stripNumbers.js";
import countSentences from "../helpers/sentence/countSentences.js";
import countWords from "../helpers/word/countWords.js";
import countSyllables from "../helpers/syllables/countSyllables.js";
import { clamp, inRange } from "lodash-es";

/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
const getAverage = function( total, amount ) {
	return total / amount;
};

/**
 * The Flesch reading ease difficulty.
 * @readonly
 * @enum {number}
 */
export const DIFFICULTY = {
	NO_DATA: -1,
	VERY_EASY: 0,
	EASY: 1,
	FAIRLY_EASY: 2,
	OKAY: 3,
	FAIRLY_DIFFICULT: 4,
	DIFFICULT: 5,
	VERY_DIFFICULT: 6,
};

/**
 * Returns the Flesch reading ease difficulty based on the boundaries
 * defined in the score configuration.
 *
 * @param {number} score The Flesch reading ease score.
 * @param {Object} scoreConfiguration The score configuration.
 *
 * @returns {DIFFICULTY} The Flesch reading ease difficulty.
 */
function getDifficulty( score, scoreConfiguration ) {
	if ( score >= scoreConfiguration.borders.veryEasy ) {
		return DIFFICULTY.VERY_EASY;
	} else if ( inRange( score, scoreConfiguration.borders.easy, scoreConfiguration.borders.veryEasy ) ) {
		return DIFFICULTY.EASY;
	} else if ( inRange( score, scoreConfiguration.borders.fairlyEasy, scoreConfiguration.borders.easy ) ) {
		return DIFFICULTY.FAIRLY_EASY;
	} else if ( inRange( score, scoreConfiguration.borders.okay, scoreConfiguration.borders.fairlyEasy ) ) {
		return DIFFICULTY.OKAY;
	} else if ( inRange( score, scoreConfiguration.borders.fairlyDifficult, scoreConfiguration.borders.okay ) ) {
		return DIFFICULTY.FAIRLY_DIFFICULT;
	} else if ( inRange( score, scoreConfiguration.borders.difficult, scoreConfiguration.borders.fairlyDifficult ) ) {
		return DIFFICULTY.DIFFICULT;
	}

	return DIFFICULTY.VERY_DIFFICULT;
}

/**
 * Retrieves the scoring configuration defining the boundaries to use to
 * determine the Flesch reading ease difficulty.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Object} The language specific scoring configuration, or the default configuration if not available.
 */
function getConfiguration( researcher ) {
	const languageSpecificConfig = researcher.getConfig( "fleschReadingEaseScores" );
	const defaultConfig = {
		borders: {
			veryEasy: 90,
			easy: 80,
			fairlyEasy: 70,
			okay: 60,
			fairlyDifficult: 50,
			difficult: 30,
			veryDifficult: 0,
		},
		scores: {
			veryEasy: 9,
			easy: 9,
			fairlyEasy: 9,
			okay: 9,
			fairlyDifficult: 6,
			difficult: 3,
			veryDifficult: 3,
		},
	};
	return languageSpecificConfig ? languageSpecificConfig : defaultConfig;
}

/**
 * This calculates the Flesch reading score for a given text.
 *
 * @param {Paper}       paper           The paper containing the text.
 * @param {Researcher}  researcher      The researcher.
 *
 * @returns {{ score: number, difficulty: DIFFICULTY }} The Flesch reading score.
 */
export default function( paper, researcher ) {
	const syllables = researcher.getConfig( "syllables" );
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const languageSpecificConfiguration = getConfiguration( researcher );

	let text = paper.getText();
	if ( text === "" ) {
		return {
			score: "?", // TODO: sensible score value. hugo: I propose X.X or sth
			difficulty: DIFFICULTY.NO_DATA,
		};
	}

	text = stripNumbers( text );

	const numberOfSentences = countSentences( text, memoizedTokenizer );

	const numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return {
			score: 100,
			difficulty: DIFFICULTY.VERY_EASY,
		};
	}

	const numberOfSyllables = countSyllables( text, syllables );
	const averageWordsPerSentence = getAverage( numberOfWords, numberOfSentences );
	const syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );
	const statistics = {
		numberOfSentences,
		numberOfWords,
		numberOfSyllables,
		averageWordsPerSentence,
		syllablesPer100Words,
	};

	const getScore = researcher.getHelper( "fleschReadingScore" );

	const score = clamp( getScore( statistics ), 0, 100 );

	const difficulty = getDifficulty( score, languageSpecificConfiguration );

	return { score, difficulty };
}
