import { register, dispatch, createReduxStore } from "@wordpress/data";
import { Fill } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";

import Workouts from "./workouts/redux/container";
import * as actions from "./workouts/redux/actions";
import * as selectors from "./workouts/redux/selectors";
import workoutsReducer from "./workouts/redux/reducer";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";

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
	registerReactComponent( key, () => <Fill name={ `${ key }` }><Component /></Fill> );
};

domReady( () => {
	renderReactRoot( "wpseo-workouts-container-free", <Workouts /> );
} );
