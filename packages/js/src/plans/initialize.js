import { SlotFillProvider } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { App } from "./app";
import { STORE_NAME } from "./constants";
import {
	DUPLICATE_POST_NAME,
	LINK_PARAMS_NAME,
	PREFERENCES_NAME,
	CURRENT_PROMOTIONS_NAME,
	USER_CAN_NAME,
	registerStore,
} from "./store";

domReady( () => {
	const root = document.getElementById( "yoast-seo-plans" );
	if ( ! root ) {
		return;
	}

	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			[ PREFERENCES_NAME ]: get( window, "wpseoScriptData.preferences", {} ),
			[ DUPLICATE_POST_NAME ]: get( window, "wpseoScriptData.duplicatePost", {} ),
			[ USER_CAN_NAME ]: get( window, "wpseoScriptData.userCan", {} ),
			[ CURRENT_PROMOTIONS_NAME ]: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
		},
	} );

	// Add complex initial state to the store.
	dispatch( STORE_NAME ).addManyAddOns( get( window, "wpseoScriptData.addOns", {} ) );

	fixWordPressMenuScrolling();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	createRoot( root ).render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<App />
			</SlotFillProvider>
		</Root>
	);
} );
