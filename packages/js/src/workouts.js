import { registerStore } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";

import Workouts from "./workouts/redux/container";
import * as actions from "./workouts/redux/actions";
import * as selectors from "./workouts/redux/selectors";
import workoutsReducer from "./workouts/redux/reducer";

const { setWordPressSeoL10n } = window.yoast.editorModules.helpers.i18n;
setWordPressSeoL10n();

registerStore( "yoast-seo/workouts", {
	reducer: workoutsReducer,
	actions,
	selectors,
} );

domReady( () => {
	render(
		<Workouts />,
		document.getElementById( "wpseo-workouts-container" ),
	);
} );
