import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Alert, Root } from "@yoast/ui-library";
import { get } from "lodash";

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-integrations" );
	if ( ! root ) {
		return;
	}

	render(
		<Root context={ context }>
			<Alert>
				Integrations placeholder
			</Alert>
		</Root>,
		root
	);
} );
