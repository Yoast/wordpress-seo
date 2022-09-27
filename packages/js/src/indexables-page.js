import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import LandingPage from "./indexables-page/landing-page";

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-indexables-page" );
	if ( ! root ) {
		return;
	}

	render(
		<Root context={ context }>
			<div className="yst-max-w-7xl yst-h-full yst-border-y yst-border-gray-300 yst-py-2">
				<LandingPage />
			</div>
		</Root>,
		root
	);
} );
