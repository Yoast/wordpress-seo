import domReady from "@wordpress/dom-ready";

import { renderReactRoot } from "./helpers/reactRoot";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";

domReady( () => {
	const rootId = "wpseo-first-time-configuration";
	if ( document.getElementById( rootId ) ) {
		renderReactRoot( rootId, <FirstTimeConfigurationSteps /> );
	}
} );
