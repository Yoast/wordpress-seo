import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { Dashboard } from "../dashboard";
import { DataFormatter } from "../dashboard/services/data-formatter";
import { DataProvider } from "../dashboard/services/data-provider";
import { RemoteDataProvider } from "../dashboard/services/remote-data-provider";
import { WidgetFactory } from "../dashboard/services/widget-factory";
import { ADMIN_URL_NAME, LINK_PARAMS_NAME } from "../shared-admin/store";
import App from "./app";
import { RouteErrorFallback } from "./components";
import { ConnectedPremiumUpsellList } from "./components/connected-premium-upsell-list";
import { SidebarLayout } from "./components/sidebar-layout";
import { STORE_NAME } from "./constants";
import { AlertCenter, FirstTimeConfiguration, ROUTES } from "./routes";
import registerStore from "./store";
import { ADMIN_NOTICES_NAME } from "./store/admin-notices";
import { ALERT_CENTER_NAME } from "./store/alert-center";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Links} Links
 * @type {import("../index").Endpoints} Endpoints
 */

domReady( () => { // eslint-disable-line complexity
	const root = document.getElementById( "yoast-seo-general" );
	if ( ! root ) {
		return;
	}
	registerStore( {
		initialState: {
			[ ADMIN_URL_NAME ]: get( window, "wpseoScriptData.adminUrl", "" ),
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
	const userLocale = document.getElementsByTagName( "html" )?.[ 0 ]?.getAttribute( "lang" ) || "en-US";
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
		timeBasedSeoMetrics: get( window, "wpseoScriptData.dashboard.endpoints.timeBasedSeoMetrics", "" ),
		siteKitConfigurationDismissal: get( window, "wpseoScriptData.dashboard.endpoints.siteKitConfigurationDismissal", "" ),
		siteKitConsentManagement: get( window, "wpseoScriptData.dashboard.endpoints.siteKitConsentManagement", "" ),
	};
	/** @type {Object<string,string>} */
	const headers = {
		"X-Wp-Nonce": get( window, "wpseoScriptData.dashboard.nonce", "" ),
	};

	/** @type {Links} */
	const links = {
		dashboardLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-learn-more" ),
		errorSupport: select( STORE_NAME ).selectAdminLink( "?page=wpseo_page_support" ),
		siteKitLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-site-kit-learn-more" ),
		siteKitConsentLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-site-kit-consent-learn-more" ),
		topPagesInfoLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-top-content-learn-more" ),
		topQueriesInfoLearnMore: select( STORE_NAME ).selectLink( "https://yoa.st/dashboard-top-queries-learn-more" ),
	};

	const siteKitConfiguration = get( window, "wpseoScriptData.dashboard.siteKitConfiguration", {
		isInstalled: false,
		isActive: false,
		isSetupCompleted: false,
		isConnected: false,
		installUrl: "",
		activateUrl: "",
		setupUrl: "",
		isFeatureEnabled: false,
		isConfigurationDismissed: false,
	} );

	const remoteDataProvider = new RemoteDataProvider( { headers } );
	const dataProvider = new DataProvider( { contentTypes, userName, features, endpoints, headers, links, siteKitConfiguration } );
	const dataFormatter = new DataFormatter( { locale: userLocale } );
	const widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatter );

	const initialWidgets = [];

	// If site kit feature is enabled, add the site kit setup widget.
	if ( siteKitConfiguration.isFeatureEnabled && ! siteKitConfiguration.isConfigurationDismissed && ! siteKitConfiguration.isConnected ) {
		initialWidgets.push( WidgetFactory.types.siteKitSetup );
	}

	// If site kit feature is enabled and connected: add the top pages widget.
	if ( siteKitConfiguration.isFeatureEnabled && siteKitConfiguration.isConnected ) {
		initialWidgets.push( WidgetFactory.types.topPages, WidgetFactory.types.topQueries );
	}

	initialWidgets.push( WidgetFactory.types.seoScores, WidgetFactory.types.readabilityScores );

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App /> } errorElement={ <RouteErrorFallback className="yst-m-8" /> }>
				<Route
					path={ ROUTES.dashboard }
					element={
						<SidebarLayout>
							<Dashboard
								widgetFactory={ widgetFactory }
								initialWidgets={ initialWidgets }
								userName={ userName }
								features={ features }
								links={ links }
								sitekitFeatureEnabled={ siteKitConfiguration.isFeatureEnabled }
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
