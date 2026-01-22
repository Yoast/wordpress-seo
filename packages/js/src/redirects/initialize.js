import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import registerStore from "./store";
import { select } from "@wordpress/data";
import { STORE_NAME } from "./constants";
import { AppProvider } from "./appProvider";
import { LINK_PARAMS_NAME, PLUGIN_URL_NAME, WISTIA_EMBED_PERMISSION_NAME } from "../shared-admin/store";
import { PREFERENCES_NAME } from "./store/preferences";
import { get } from "lodash";

domReady( () => {
	const root = document.getElementById( "yoast-seo-redirects" );
	if ( ! root ) {
		return;
	}

	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			[ PREFERENCES_NAME ]: get( window, "wpseoScriptData.preferences", {} ),
			[ PLUGIN_URL_NAME ]: get( window, "wpseoScriptData.pluginUrl", "" ),
			[ WISTIA_EMBED_PERMISSION_NAME ]: {
				value: get( window, "wpseoScriptData.wistiaEmbedPermission", false ) === "1",
			},
		},
	} );

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<AppProvider />
		</Root>,
		root
	);
} );
