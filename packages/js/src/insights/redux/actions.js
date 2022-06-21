import { toSafeInteger } from "lodash";
import EstimatedReadingTimeFields from "../../helpers/fields/EstimatedReadingTimeFields";

export const SET_ESTIMATED_READING_TIME = "SET_ESTIMATED_READING_TIME";
export const LOAD_ESTIMATED_READING_TIME = "LOAD_ESTIMATED_READING_TIME";
export const SET_FLESCH_READING_EASE = "SET_FLESCH_READING_EASE";
export const SET_PROMINENT_WORDS = "SET_PROMINENT_WORDS";
export const SET_WORD_COUNT = "SET_WORD_COUNT";

/**
 * Sets the estimated reading time to the store.
 *
 * @param {number} estimatedReadingTime The estimated reading time from the researcher.
 *
 * @returns {Object} The SET_ESTIMATED_READING_TIME action.
 */
export const setEstimatedReadingTime = estimatedReadingTime => {
	EstimatedReadingTimeFields.estimatedReadingTime = estimatedReadingTime.toString();
	return {
		type: SET_ESTIMATED_READING_TIME,
		payload: estimatedReadingTime,
	};
};

/**
 * Loads the Estimated Reading Time from the hidden field to the store.
 *
 * @returns {Object} The LOAD_ESTIMATED_READING_TIME action.
 */
export const loadEstimatedReadingTime = () => ( {
	type: LOAD_ESTIMATED_READING_TIME,
	payload: toSafeInteger( EstimatedReadingTimeFields.estimatedReadingTime ),
} );

/**
 * @param {number} score The score.
 * @param {string} [text] The explanation text.
 *
 * @returns {Object} The action.
 */
export const setFleschReadingEase = ( score, text = "" ) => ( {
	type: SET_FLESCH_READING_EASE,
	payload: {
		score,
		text,
	},
} );

/**
 * @param {Object[]} prominentWords The prominent words.
 *
 * @returns {Object} The action.
 */
export const setProminentWords = prominentWords => ( {
	type: SET_PROMINENT_WORDS,
	payload: prominentWords,
} );

/**
 * @param {number} wordCount The word count.
 *
 * @returns {Object} The action.
 */
export const setWordCount = wordCount => ( {
	type: SET_WORD_COUNT,
	payload: wordCount,
} );
