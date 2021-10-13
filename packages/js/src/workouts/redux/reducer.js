import { union, merge, cloneDeep } from "lodash";
import {
	CLEAR_ACTIVE_WORKOUT, FINISH_STEPS, OPEN_WORKOUT,
	SET_WORKOUTS, TOGGLE_STEP, TOGGLE_WORKOUT,
} from "./actions";
import { FINISHABLE_STEPS } from "../config";

/**
 * Initial state
 */
const initialState = {
	loading: true,
	activeWorkout: "",
	workouts: {
		cornerstone: {
			finishedSteps: [],
			indexablesByStep: {},
		},
		orphaned: {
			finishedSteps: [],
			indexablesByStep: {},
		},
	},
};

/* eslint-disable complexity */
/**
 * A reducer for the SEO workouts.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated workouts object.
 */
const workoutsReducer = ( state = initialState, action ) => {
	let i;
	const newState = cloneDeep( state );
	switch ( action.type ) {
		case FINISH_STEPS:
			newState.workouts[ action.workout ].finishedSteps =  union( state.workouts[ action.workout ].finishedSteps, action.steps );
			return newState;
		case TOGGLE_STEP:
			if ( state.workouts[ action.workout ].finishedSteps.includes( action.step ) ) {
				i = state.workouts[ action.workout ].finishedSteps.indexOf( action.step );
				if ( i > -1 ) {
					newState.workouts[ action.workout ].finishedSteps = state.workouts[ action.workout ].finishedSteps.slice();
					newState.workouts[ action.workout ].finishedSteps.splice( i, 1 );
				}
				return newState;
			}
			newState.workouts[ action.workout ].finishedSteps = union( state.workouts[ action.workout ].finishedSteps, [ action.step ] );
			return newState;
		case TOGGLE_WORKOUT:
			if ( FINISHABLE_STEPS[ action.workout ].length === state.workouts[ action.workout ].finishedSteps.length ) {
				newState.workouts[ action.workout ].finishedSteps = [];
				for ( const step of FINISHABLE_STEPS[ action.workout ] ) {
					newState.workouts[ action.workout ].indexablesByStep[ step ] = initialState.workouts[ action.workout ].indexablesByStep[ step ];
				}
			} else {
				newState.workouts[ action.workout ].finishedSteps = FINISHABLE_STEPS[ action.workout ];
			}
			return newState;
		case OPEN_WORKOUT:
			newState.activeWorkout = action.workout;
			return newState;
		case CLEAR_ACTIVE_WORKOUT:
			newState.activeWorkout = "";
			return newState;
		case SET_WORKOUTS:
			newState.workouts = merge( newState.workouts, action.workouts );
			newState.loading = false;
			return newState;
		default:
			return state;
	}
};

export default workoutsReducer;
