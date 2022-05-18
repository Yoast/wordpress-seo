import domReady from "@wordpress/dom-ready";

import { renderReactRoot } from "./helpers/reactRoot";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";
import getL10nObject from "./analysis/getL10nObject";

domReady( () => {
	const rootId = "wpseo-first-time-configuration";
	if ( document.getElementById( rootId ) ) {
		const theme = {
			isRtl: getL10nObject().isRtl,
		};

		renderReactRoot( {
			target: rootId,
			children: <FirstTimeConfigurationSteps />,
			// A location of type "sidebar", "metabox" or "modal" is required, but not used, so this is added to prevent a warning in the console.
			location: "sidebar",
			theme,
		} );
	}
} );
