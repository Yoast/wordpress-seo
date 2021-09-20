import { CakeIcon } from "@heroicons/react/outline";

import exampleConfig from "../qa/example-config";
import globalApp from "../src/initializers/global-app";
import initialize from "../src/index";

// Runs the settings UI example app without the QA wrapper.

const settingsApp = initialize( exampleConfig );

settingsApp.render( document.getElementById( "app" ) );

// Yoast SEO "Cake add-on"
window.yoast.navigation.registerGroup(
	{
		icon: CakeIcon,
		label: "Navgroup Label",
		key: "navgroup-key",
		priority: 75,
		isDefaultOpen: true,
		children: [
			{ label: "First child", target: "child-target-1", key: "child-key-1", priority: 99, component: () => "renderstuff for the first child" },
		],
	},
);

window.yoast.navigation.registerItem( {
	label: "Second child",
	groupKey: "navgroup-key",
	key: "child-key-2",
	target: "child-target-2",
	priority: 55,
	component: () => "renderstuff for the second child",
} );

globalApp.registerFill( "schema.breadcrumbs", () => <p>something for the breadcrumbs</p> );
globalApp.registerFill( "schema.breadcrumbs", () => <p>something first for the breadcrumbs</p>, 1 );
globalApp.registerFill( "other.slot", () => <p>other content</p> );

// This will add `someApi` to the data, but will NOT override the already exsiting `restApiEndpoint` with `false`.
// globalApp.registerCustomDataCallback( () => ( { featureToggles: { apis: { someApi: true, restApiEndpoint: false } } } ) );
