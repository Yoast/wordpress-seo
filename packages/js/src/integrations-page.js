import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import Card from "./integrations-page/tailwind-components/card";

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
			<div className="yst-flex yst-flex-wrap yst-justify-items-start yst-py-6">
				<Card/>
				<Card/>
				<Card/>
				<Card/>
			</div>
		</Root>,
		root
	);
} );
