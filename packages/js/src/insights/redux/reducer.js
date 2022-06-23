import { LOAD_ESTIMATED_READING_TIME, SET_ESTIMATED_READING_TIME, SET_FLESCH_READING_EASE, SET_WORD_COUNT } from "./actions";

const INITIAL_STATE = {
	estimatedReadingTime: 0,
	fleschReadingEaseScore: 0,
	fleschReadingEaseDifficulty: 0,
	wordCount: 0,
};

/**
 * Reduces the insights data.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 * @param {string} action.type The action type.
 * @param {*} action.payload The action payload.
 *
 * @returns {Object} The new state.
 */
const reducer = ( state = INITIAL_STATE, { type, payload } ) => {
	switch ( type ) {
		case LOAD_ESTIMATED_READING_TIME:
			return {
				...state,
				estimatedReadingTime: payload,
			};
		case SET_ESTIMATED_READING_TIME:
			return {
				...state,
				estimatedReadingTime: payload,
			};
		case SET_FLESCH_READING_EASE:
			return {
				...state,
				fleschReadingEaseScore: payload.score,
				fleschReadingEaseDifficulty: payload.difficulty,
			};
		case SET_WORD_COUNT:
			return {
				...state,
				wordCount: payload,
			};
		default:
			return state;
	}
};

export default reducer;
