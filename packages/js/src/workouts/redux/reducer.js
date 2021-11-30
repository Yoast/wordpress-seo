import { union, merge, get, cloneDeep } from "lodash";
import {
	CLEAR_ACTIVE_WORKOUT, CLEAR_INDEXABLES,
	CLEAR_INDEXABLES_IN_STEPS,
	FINISH_STEPS, REVISE_STEP, MOVE_INDEXABLES, OPEN_WORKOUT,
	SET_WORKOUTS, TOGGLE_STEP, TOGGLE_WORKOUT, REGISTER_WORKOUT,
} from "./actions";
import { FINISHABLE_STEPS, STEPS } from "../config";

/**
 * Initial state
 */
const initialState = {
	loading: true,
	activeWorkout: "",
	workouts: {
		configuration: {
			priority: 10,
			finishedSteps: [],
		},
		cornerstone: {
			priority: 50,
			finishedSteps: [],
			indexablesByStep: {
				[ STEPS.cornerstone.addLinks ]: [],
				[ STEPS.cornerstone.checkLinks ]: [],
				[ STEPS.cornerstone.chooseCornerstones ]: [],
				[ STEPS.orphaned.improved ]: [],
				[ STEPS.orphaned.skipped ]: [],
			},
		},
		orphaned: {
			priority: 50,
			finishedSteps: [],
			indexablesByStep: {
				[ STEPS.orphaned.improveRemove ]: get( window, "wpseoPremiumWorkoutsData.orphaned", [] ),
				[ STEPS.orphaned.update ]: [],
				[ STEPS.orphaned.addLinks ]: [],
				[ STEPS.orphaned.removed ]: [],
				[ STEPS.orphaned.noindexed ]: [],
				[ STEPS.orphaned.improved ]: [],
				[ STEPS.orphaned.skipped ]: [],
			},
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
		case REGISTER_WORKOUT:
			newState.workouts[ action.payload.key ] = {
				finishedSteps: [],
				indexablesByStep: {},
				...newState.workouts[ action.payload.key ],
				priority: action.payload.priority,
			};
			return newState;
		case FINISH_STEPS:
			newState.workouts[ action.workout ].finishedSteps = union( state.workouts[ action.workout ].finishedSteps, action.steps );
			return newState;
		case REVISE_STEP:
			newState.workouts[ action.workout ].finishedSteps = newState.workouts[ action.workout ].finishedSteps.filter(
				step => step !== action.step
			);
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
					if ( initialState.workouts[ action.workout ].indexablesByStep ) {
						newState.workouts[ action.workout ].indexablesByStep[ step ] = initialState
							.workouts[ action.workout ]
							.indexablesByStep[ step ];
					}
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
		case MOVE_INDEXABLES:
			action.indexables.forEach( function( indexable ) {
				if ( action.fromStep !== "" ) {
					const oldLocation = newState.workouts[ action.workout ].indexablesByStep[ action.fromStep ].findIndex(
						storedIndexable => storedIndexable.id === indexable.id
					);
					newState.workouts[ action.workout ].indexablesByStep[ action.fromStep ][ oldLocation ].purge = true;
					newState.workouts[ action.workout ].indexablesByStep[ action.fromStep ][ oldLocation ].movedTo = action.toStep;
				}
				if ( action.toStep !== "" ) {
					const oldLocation = newState.workouts[ action.workout ].indexablesByStep[ action.toStep ].findIndex(
						storedIndexable => storedIndexable.id === indexable.id
					);
					// If the indexable is not yet in the toStep, add it. Else, simply reactivate it.
					if ( oldLocation === -1 ) {
						newState.workouts[ action.workout ].indexablesByStep[ action.toStep ].push( indexable );
					} else {
						newState.workouts[ action.workout ].indexablesByStep[ action.toStep ][ oldLocation ].purge = false;
						newState.workouts[ action.workout ].indexablesByStep[ action.toStep ][ oldLocation ].movedTo = "";
					}
				}
			} );
			return newState;
		case CLEAR_INDEXABLES:
			newState.workouts[ action.workout ].indexablesByStep = initialState.workouts[ action.workout ].indexablesByStep;
			return newState;
		case CLEAR_INDEXABLES_IN_STEPS:
			for ( const step of action.steps ) {
				newState.workouts[ action.workout ].indexablesByStep[ step ] = [];
			}
			return newState;
		default:
			return state;
	}
};

export default workoutsReducer;
