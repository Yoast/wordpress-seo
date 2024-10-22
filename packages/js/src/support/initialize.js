import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { App } from "./app";
import { STORE_NAME } from "./constants";
import { registerStore } from "./store";
import { PREFERENCES_NAME } from "./store/preferences";

domReady( () => {
	const root = document.getElementById( "yoast-seo-support" );
	if ( ! root ) {
		return;
	}
	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			[ PREFERENCES_NAME ]: get( window, "wpseoScriptData.preferences", {} ),
			currentPromotions: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
		},
	} );
	fixWordPressMenuScrolling();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<App />
			</SlotFillProvider>
		</Root>,
		root
	);
} );
