import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import LandingPage from "./indexables-page/landing-page";

domReady( () => {
	console.warn( "REMEMBER TO FIX RTL IN INDEXABLES-PAGE.JS" );
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-indexables-page" );
	if ( ! root ) {
		return;
	}

	render(
		<Root context={ context }>
			<LandingPage />
		</Root>,
		root
	);
} );
