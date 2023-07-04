import { Fill, Slot } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";
import { get } from "lodash";
import { LINK_PARAMS_NAME, PLUGIN_URL_NAME } from "../shared-admin/store";
import { Content, Modal } from "./components";
import { registerReactComponent, renderReactRoot } from "./helpers";
import { registerStore } from "./store";

window.YoastSEO = window.YoastSEO || {};
window.YoastSEO._registerNewFeatureComponent = ( key, Component ) => {
	/**
	 * @returns {JSX.Element} The element.
	 */
	const NewFeatureWithFill = () => <Fill name="new-feature-slot"><Component /></Fill>;
	registerReactComponent( key, NewFeatureWithFill );
};

domReady( () => {
	registerStore( {
		[ LINK_PARAMS_NAME ]: get( window, "wpseoNewFeatures.linkParams", {} ),
		[ PLUGIN_URL_NAME ]: get( window, "wpseoNewFeatures.pluginUrl", "" ),
	} );

	const context = {
		isRtl: Boolean( get( window, "wpseoNewFeatures.isRtl", false ) ),
	};

	const isPremium = get( window, "wpseoNewFeatures.isPremium", false );
	if ( ! isPremium ) {
		window.YoastSEO._registerNewFeatureComponent( "ai-generate-title-description", Content );
	}

	const root = document.createElement( "div" );
	root.id = "wpseo-new-features";
	document.body.appendChild( root );

	renderReactRoot( (
		<Modal>
			<Slot key="new-feature-slot" name="new-feature-slot" />
		</Modal>
	), root, context );
} );
