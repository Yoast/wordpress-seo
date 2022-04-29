import domReady from "@wordpress/dom-ready";

import { renderReactRoot } from "./helpers/reactRoot";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";

domReady( () => {
	renderReactRoot( "wpseo-first-time-configuration", <FirstTimeConfigurationSteps /> );
} );
