import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { ALERT_CENTER_NAME } from "./store/alert-center";
import { HashRouter } from "react-router-dom";
import App from "./app";
import { STORE_NAME } from "./constants";
import registerStore from "./store";

domReady( () => {
	const root = document.getElementById( "yoast-seo-dashboard" );
	if ( ! root ) {
		return;
	}
	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			[ ALERT_CENTER_NAME ]: { alerts: get( window, "wpseoScriptData.alerts", [] ) },
			currentPromotions: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
			dismissedAlerts: get( window, "wpseoScriptData.dismissedAlerts", {} ),
			isPremium: get( window, "wpseoScriptData.preferences.isPremium", false ),
		},
	} );
	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<HashRouter>
					<App />
				</HashRouter>
			</SlotFillProvider>
		</Root>,
		root
	);
} );
