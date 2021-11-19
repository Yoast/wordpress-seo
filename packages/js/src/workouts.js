import { register, dispatch, createReduxStore } from "@wordpress/data";
import { Fill } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";

import Workouts from "./workouts/redux/container";
import * as actions from "./workouts/redux/actions";
import * as selectors from "./workouts/redux/selectors";
import workoutsReducer from "./workouts/redux/reducer";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import { setWordPressSeoL10n } from "./helpers/i18n";
import ConfigurationWorkoutCard from "./workouts/components/ConfigurationWorkoutCard";

setWordPressSeoL10n();

const store = createReduxStore( "yoast-seo/workouts", {
	reducer: workoutsReducer,
	actions,
	selectors,
} );

register( store );

/**
 * Registers a workout-card component to render in free.
 *
 * @param {string} key           An identifier for the workout.
 * @param {number} priority      A priority for the workout (lower number = higher priority).
 * @param {wp.Element} Component The WorkoutCard component.
 *
 * @returns {void}
 */
function registerWorkout( key, priority, Component ) {
	dispatch( "yoast-seo/workouts" ).registerWorkout( key, priority );
	registerReactComponent( key, () => <Fill name={ `${ key }` }><Component /></Fill> );
}

window.wpseoWorkoutsData = window.wpseoWorkoutsData || {};
window.wpseoWorkoutsData.registerWorkout = registerWorkout;

if ( window.wpseoWorkoutsData.canDoConfigurationWorkout ) {
	registerWorkout( "configuration", 1, () => <ConfigurationWorkoutCard /> );
}

domReady( () => {
	renderReactRoot( "wpseo-workouts-container-free", <Workouts /> );
} );
