import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { Dashboard } from "../dashboard";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import App from "./app";
import { RouteErrorFallback } from "./components";
import { SidebarLayout } from "./components/sidebar-layout";
import { STORE_NAME } from "./constants";
import { AlertCenter, FirstTimeConfiguration, ROUTES } from "./routes";
import registerStore from "./store";
import { ALERT_CENTER_NAME } from "./store/alert-center";
import { FTC_NAME } from "./store/first-time-configuration";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Links} Links
 */

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

	/** @type {ContentType[]} */
	const contentTypes = get( window, "wpseoScriptData.dashboard.contentTypes", [] );
	/** @type {string} */
	const userName = get( window, "wpseoScriptData.dashboard.displayName", "User" );
	/** @type {Features} */
	const features = {
		indexables: get( window, "wpseoScriptData.dashboard.indexablesEnabled", false ),
		seoAnalysis: get( window, "wpseoScriptData.dashboard.enabledAnalysisFeatures.keyphraseAnalysis", false ),
		readabilityAnalysis: get( window, "wpseoScriptData.dashboard.enabledAnalysisFeatures.readabilityAnalysis", false ),
	};

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> } errorElement={ <RouteErrorFallback className="yst-m-8" /> }>
				<Route
					path={ ROUTES.dashboard }
					element={
						<SidebarLayout>
							<Dashboard contentTypes={ contentTypes } userName={ userName } features={ features } />
						</SidebarLayout>
					}
					errorElement={ <RouteErrorFallback /> }
				/>
				<Route
					path={ ROUTES.alertCenter }
					element={ <SidebarLayout><AlertCenter /></SidebarLayout> }
					errorElement={ <RouteErrorFallback /> }
				/>
				<Route path={ ROUTES.firstTimeConfiguration } element={ <FirstTimeConfiguration /> } errorElement={ <RouteErrorFallback /> } />
				{
					/**
					 * Fallback route: redirect to the dashboard.
					 * A redirect is used to support the activePath in the menu. E.g. `pathname` matches exactly.
					 * It replaces the current path to not introduce invalid history in the browser (that would just redirect again).
					 */
				}
				<Route path="*" element={ <Navigate to={ ROUTES.dashboard } replace={ true } /> } />
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
