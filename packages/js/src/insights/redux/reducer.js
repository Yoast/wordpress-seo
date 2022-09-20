import { LOAD_ESTIMATED_READING_TIME, SET_ESTIMATED_READING_TIME, SET_FLESCH_READING_EASE, SET_TEXT_LENGTH } from "./actions";

const INITIAL_STATE = {
	estimatedReadingTime: 0,
	textLength: {},
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
		case SET_TEXT_LENGTH:
			return {
				...state,
				textLength: payload,
			};
		default:
			return state;
	}
};

export default reducer;
