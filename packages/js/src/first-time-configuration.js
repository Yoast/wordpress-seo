import domReady from "@wordpress/dom-ready";

import { renderReactRoot } from "./helpers/reactRoot";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";

console.log( "hi!" );
domReady( () => {
	console.log( "hi again!", document.getElementById( "wpseo-first-time-configuration" ) );
	renderReactRoot( "wpseo-first-time-configuration", <FirstTimeConfigurationSteps
		finishSteps={ () => {} }
		reviseStep={ () => {} }
	/> );
} );
