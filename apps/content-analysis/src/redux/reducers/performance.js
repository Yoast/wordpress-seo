import { constant, max, min, sum, times } from "lodash-es";
import { ADD_PERFORMANCE_RESULT, SET_PERFORMANCE_BATCH_SIZE, SET_PERFORMANCE_RESEARCHES, SET_PERFORMANCE_RESULTS } from "../actions/performance";

const INITIAL_STATE = {
	batchSize: 50,
	researches: [],
	results: {},
};

const addResult = ( state, action ) => {
	const newState = { ...state };
	const { research, timeElapsed, batchSize } = action.payload;

	const average = timeElapsed / batchSize;
	const runs = times( batchSize, constant( average ) );

	if ( ! newState.results[ research ] ) {
		newState.results[ research ] = { runs: [] };
	}

	newState.results[ research ].runs.push( ...runs );
	newState.results[ research ].average = sum( newState.results[ research ].runs ) / newState.results[ research ].runs.length;
	newState.results[ research ].min = min( newState.results[ research ].runs );
	newState.results[ research ].max = max( newState.results[ research ].runs );

	return newState;
};

export const performance = ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case SET_PERFORMANCE_BATCH_SIZE:
			return {
				...state,
				batchSize: action.payload,
			};
		case SET_PERFORMANCE_RESEARCHES:
			return {
				...state,
				researches: action.payload,
			};
		case SET_PERFORMANCE_RESULTS:
			return {
				...state,
				results: action.payload,
			};
		case ADD_PERFORMANCE_RESULT:
			return addResult( state, action );
		default:
			return state;
	}
};
