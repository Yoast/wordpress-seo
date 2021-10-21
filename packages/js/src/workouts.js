import { register, dispatch, createReduxStore } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

import Workouts from "./workouts/redux/container";
import * as actions from "./workouts/redux/actions";
import * as selectors from "./workouts/redux/selectors";
import workoutsReducer from "./workouts/redux/reducer";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import WorkoutCard from "./workouts/components/WorkoutCard";

const { setWordPressSeoL10n } = window.yoast.editorModules.helpers.i18n;
setWordPressSeoL10n();

const store = createReduxStore( "yoast-seo/workouts", {
	reducer: workoutsReducer,
	actions,
	selectors,
} );

register( store );

window.wpseoWorkoutsData = window.wpseoWorkoutsData || {};
window.wpseoWorkoutsData.registerWorkout = ( key, priority, Component ) => {
	dispatch( "yoast-seo/workouts" ).registerWorkout( key, priority );
	registerReactComponent( key, Component );
};

const isPremium = window.wpseoWorkoutsData.isPremium;
if ( ! isPremium ) {
	/* Register the free workouts here.

	window.wpseoWorkoutsData.registerWorkout( "key", 20, () => {
		return <...WorkoutCard />;
	} );
	*/
}

window.wpseoWorkoutsData.registerWorkout( "generic-workout-card", 20, () => {
	return <WorkoutCard title={ "test" } subtitle={ "subtest" } usps={ [] } steps={ [] } finishedSteps={ [] } />;
} );


domReady( () => {
	renderReactRoot( "wpseo-workouts-container-free", <Workouts /> );
} );
