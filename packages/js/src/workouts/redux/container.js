import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { cloneDeep } from "lodash";
import WorkoutsPage from "../components/WorkoutsPage";

/**
 * Purges indexables from the workouts object.
 *
 * @param {Object} workouts The workouts object.
 *
 * @returns {Object} The purged workouts object.
 */
const purgeIndexables = function( workouts ) {
	const purgedWorkouts = cloneDeep( workouts );

	Object.keys( workouts ).forEach( function( workout ) {
		if ( workouts[ workout ].indexablesByStep ) {
			Object.keys( workouts[ workout ].indexablesByStep ).forEach( function( step ) {
				purgedWorkouts[ workout ].indexablesByStep[ step ] = purgedWorkouts[ workout ].indexablesByStep[ step ].filter(
					function( indexable ) {
						return ! indexable.purge;
					} );
			} );
		}
	} );

	return purgedWorkouts;
};

/**
 * Saves the workouts via the REST API.
 *
 * @param {object} data The workouts data.
 * @returns {boolean} If the action was successful.
 */
export async function saveWorkouts( data ) {
	try {
		const response = await apiFetch( {
			path: "yoast/v1/workouts",
			method: "POST",
			data: purgeIndexables( data ),
		} );

		return await response.json;
	} catch ( e ) {
		// URL() constructor throws a TypeError exception if url is malformed.
		console.error( e.message );
		return false;
	}
}

export default compose(
	[
		withSelect( ( select ) => {
			const workouts = select( "yoast-seo/workouts" ).getWorkouts();
			const loading = select( "yoast-seo/workouts" ).getLoading();
			const activeWorkout = select( "yoast-seo/workouts" ).getActiveWorkout();
			const finishedWorkouts = select( "yoast-seo/workouts" ).getFinishedWorkouts();
			/**
			 * Determines if a step for a particular workout is finished.
			 * @param {string} workout The name of the workout.
			 * @param {string} step The name of the step.
			 * @returns {boolean} Whether or not the step is finished.
			 */
			const isStepFinished = ( workout, step ) => {
				return workouts[ workout ].finishedSteps.includes( step );
			};
			const getIndexablesByStep = select( "yoast-seo/workouts" ).getIndexablesByStep;
			return { workouts, loading, activeWorkout, finishedWorkouts, isStepFinished, getIndexablesByStep };
		} ),
		withDispatch(
			( dispatch ) => {
				const {
					finishSteps,
					toggleStep,
					toggleWorkout,
					initWorkouts,
					clearActiveWorkout,
					openWorkout,
					moveIndexables,
					clearIndexablesInSteps,
				} = dispatch( "yoast-seo/workouts" );

				return {
					finishSteps,
					toggleStep,
					toggleWorkout,
					initWorkouts,
					clearActiveWorkout,
					openWorkout,
					moveIndexables,
					clearIndexablesInSteps,
					saveWorkouts,
				};
			}
		),
	]
)( WorkoutsPage );
