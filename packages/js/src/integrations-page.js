import { get } from "lodash";
import domReady from "@wordpress/dom-ready";

import { Root } from "@yoast/ui-library";
import IntegrationsGrid from "./integrations-page/integrations-grid";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";

window.YoastSEO = window.YoastSEO || {};
window.YoastSEO._registerReactComponent = registerReactComponent;

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};

	renderReactRoot(
		"wpseo-integrations",
		<Root context={ context }>
			<IntegrationsGrid />
		</Root>
	);
} );
