import domReady from "@wordpress/dom-ready";

import { renderReactRoot } from "./helpers/reactRoot";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";
import getL10nObject from "./analysis/getL10nObject";

domReady( () => {
	const rootId = "wpseo-first-time-configuration";
	if ( document.getElementById( rootId ) ) {
		const localizedData = getL10nObject();

		const theme = {
			isRtl: localizedData.isRtl,
		};

		renderReactRoot( {
			target: rootId,
			children: [ <FirstTimeConfigurationSteps/> ],
			theme,
		} );
	}
} );
