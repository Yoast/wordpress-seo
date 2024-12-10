import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { Dashboard } from "../dashboard";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { ADMIN_NOTICES_NAME } from "./store/admin-notices";
import App from "./app";
import { RouteErrorFallback } from "./components";
import { ConnectedPremiumUpsellList } from "./components/connected-premium-upsell-list";
import { SidebarLayout } from "./components/sidebar-layout";
import { STORE_NAME } from "./constants";
import { AlertCenter, FirstTimeConfiguration, ROUTES } from "./routes";
import registerStore from "./store";
import { ALERT_CENTER_NAME } from "./store/alert-center";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Links} Links
 * @type {import("../index").Endpoints} Endpoints
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
			[ ADMIN_NOTICES_NAME ]: { resolvedNotices: [] },
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

	/** @type {Endpoints} */
	const endpoints = {
		seoScores: get( window, "wpseoScriptData.dashboard.endpoints.seoScores", "" ),
		readabilityScores: get( window, "wpseoScriptData.dashboard.endpoints.readabilityScores", "" ),
	};
	/** @type {Object<string,string>} */
	const headers = {
		"X-Wp-Nonce": get( window, "wpseoScriptData.dashboard.nonce", "" ),
	};

	/** @type {{dashboardLearnMore: string}} */
	const links = {
		dashboardLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-learn-more" ),
	};

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> } errorElement={ <RouteErrorFallback className="yst-m-8" /> }>
				<Route
					path={ ROUTES.dashboard }
					element={
						<SidebarLayout>
							<Dashboard
								contentTypes={ contentTypes }
								userName={ userName }
								features={ features }
								endpoints={ endpoints }
								headers={ headers }
								links={ links }
							/>
							<ConnectedPremiumUpsellList />
						</SidebarLayout>
					}
					errorElement={ <RouteErrorFallback /> }
				/>
				<Route
					path={ ROUTES.alertCenter }
					element={ <SidebarLayout><AlertCenter /><ConnectedPremiumUpsellList /></SidebarLayout> }
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
