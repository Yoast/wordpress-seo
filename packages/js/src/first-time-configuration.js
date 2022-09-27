import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import FirstTimeConfigurationSteps from "./first-time-configuration/first-time-configuration-steps";

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-first-time-configuration" );
	if ( ! root ) {
		return;
	}

	render(
		<Root context={ context }>
			<FirstTimeConfigurationSteps />
		</Root>,
		root
	);
} );
