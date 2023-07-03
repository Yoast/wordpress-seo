import domReady from "@wordpress/dom-ready";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import SlotWithDefault from "../components/slots/SlotWithDefault";
import { registerReactComponent, renderReactRoot } from "../helpers/reactRoot";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { Modal } from "./components";
import { registerStore } from "./store";

window.YoastSEO = window.YoastSEO || {};
window.YoastSEO._registerNewFeatureComponent = registerReactComponent;

domReady( () => {
	registerStore( {
		[ LINK_PARAMS_NAME ]: get( window, "wpseoNewFeatures.linkParams", {} ),
	} );

	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};

	const root = document.createElement( "div" );
	root.id = "wpseo-new-features-modal";
	document.body.appendChild( root );

	renderReactRoot(
		"wpseo-new-features-modal",
		<Root context={ context }>
			<SlotWithDefault key="new-features-slot" name="new-features-slot">
				<Modal />
			</SlotWithDefault>
		</Root>
	);
} );
