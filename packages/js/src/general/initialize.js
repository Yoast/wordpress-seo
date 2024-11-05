import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { ALERT_CENTER_NAME } from "./store/alert-center";
import { FTC_NAME } from "./store/first-time-configuration";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "./app";
import { STORE_NAME } from "./constants";
import registerStore from "./store";
import { FirstTimeConfiguration, AlertCenter } from "./routes";

domReady( () => {
	const root = document.getElementById( "yoast-seo-general" );
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
			[ FTC_NAME ]: { resolvedNotices: [] },
		},
	} );
	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> }>
				<Route path="/" element={ <AlertCenter /> } />
				{ /* Fallback to the alert center. */ }
				<Route path="*" element={ <AlertCenter /> } />
				<Route path="/first-time-configuration" element={ <FirstTimeConfiguration /> } />
			</Route>
		)
	);

	render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<RouterProvider router={ router } />
			</SlotFillProvider>
		</Root>,
		root
	);
} );
