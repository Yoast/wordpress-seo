import { SET_RESULTS } from "../actions/results";

const defaultState = {
	seo: [],
	readability: [],
};

export default function resultsReducer( state = defaultState, action ) {
	switch ( action.type ) {

		case SET_RESULTS:
			return action.results;
			break;
	}

	return state;
}
