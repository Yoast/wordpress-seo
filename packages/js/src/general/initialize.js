import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { NOTICES_NAME } from "./store/notices";
import App from "./app";
import { RouteErrorFallback } from "./components";
import { STORE_NAME } from "./constants";
import { AlertCenter, FirstTimeConfiguration } from "./routes";
import registerStore from "./store";
import { ALERT_CENTER_NAME } from "./store/alert-center";

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
			[ NOTICES_NAME ]: { resolvedNotices: [] },
		},
	} );
	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> } errorElement={ <RouteErrorFallback className="yst-m-8" /> }>
				<Route path="/" element={ <AlertCenter /> } errorElement={ <RouteErrorFallback /> } />
				<Route path="/first-time-configuration" element={ <FirstTimeConfiguration /> } errorElement={ <RouteErrorFallback /> } />
				{
					/**
					 * Fallback route: redirect to the root (alert center).
					 * A redirect is used to support the activePath in the menu. E.g. `pathname` matches exactly.
					 * It replaces the current path to not introduce invalid history in the browser (that would just redirect again).
					 */
				}
				<Route path="*" element={ <Navigate to="/" replace={ true } /> } />
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
