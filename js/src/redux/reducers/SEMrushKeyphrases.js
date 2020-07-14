import { ADD_KEYPHRASE, REMOVE_KEYPHRASE, SET_KEYPHRASE_LIMIT_REACHED } from "../actions/SEMrushKeyphrases";

const INITIAL_STATE = {
	keyphrases: [],
	isLimitReached: false,
};
/**
 * A reducer for the SEMrush keyphrases.
 *
 * @param {Object} state The current state of the object which contains the keyphrases.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function SEMrushKeyphraseReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case ADD_KEYPHRASE:
			state.keyphrases.push( action.keyphrase );
			return state;
		case REMOVE_KEYPHRASE:
			// First retrieve the index of the item, then remove the item at that index
			const index = state.keyphrases.indexOf( action.keyphrase );
			if ( index > -1 ) {
				state.keyphrases.splice( index, 1 );
			}
			return state;
		case SET_KEYPHRASE_LIMIT_REACHED:
			return {
				keyphrases: state.keyphrases,
				isLimitReached: true,
		};
		default:
			return state;
	}
}

export default SEMrushKeyphraseReducer;
