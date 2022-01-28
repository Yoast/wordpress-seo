import { register, dispatch, createReduxStore, registerStore } from "@wordpress/data";
import { Fill } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";
import getL10nObject from "./analysis/getL10nObject";
import Workouts from "./workouts/redux/container";
import * as actions from "./workouts/redux/actions";
import * as selectors from "./workouts/redux/selectors";
import workoutsReducer from "./workouts/redux/reducer";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import ConfigurationWorkoutCard from "./workouts/components/ConfigurationWorkoutCard";

if ( window.wp.data.createReduxStore ) {
	const store = createReduxStore( "yoast-seo/workouts", {
		reducer: workoutsReducer,
		actions,
		selectors,
	} );

	register( store );
} else {
	/*
	* Compatibility fix for WP 5.6.
	* Remove this and the related import when WP 5.6 is no longer supported.
	*/
	registerStore( "yoast-seo/workouts", {
		reducer: workoutsReducer,
		actions,
		selectors,
	} );
}

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
	const localizedData = getL10nObject();

	renderReactRoot( {
		target: "wpseo-workouts-container-free",
		children: <Workouts />,
		theme: { isRtl: localizedData.isRtl },
		location: "sidebar",
	} );
} );
