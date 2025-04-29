import { useCallback, useSyncExternalStore } from "@wordpress/element";
import { PageTitle } from "./page-title";
import { Dashboard as DashboardWidgets } from "@yoast/dashboard-frontend";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 * @type {import("../services/widget-factory").WidgetFactory} WidgetFactory
 */

/**
 * @param {WidgetFactory} widgetFactory The widget factory.
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @param {Links} links The links.
 * @param {boolean} sitekitFeatureEnabled Whether the site kit feature is enabled.
 * @param {import("../services/data-provider")} dataProvider The data provider.
 *
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { widgetFactory, userName, features, links, sitekitFeatureEnabled, dataProvider } ) => {
	const getSnapshotSiteKitConfiguration = useCallback( () => dataProvider.getSiteKitConfiguration(), [ dataProvider ] );
	const subscribeSiteKitConfiguration = useCallback( ( callback ) => {
		return dataProvider.subscribe( callback );
	}, [ dataProvider ] );
	useSyncExternalStore( subscribeSiteKitConfiguration, getSnapshotSiteKitConfiguration );

	return (
		<>
			<PageTitle userName={ userName } features={ features } links={ links } sitekitFeatureEnabled={ sitekitFeatureEnabled } />
			<div className="yst-@container yst-grid yst-grid-cols-4 yst-gap-6 yst-my-6">
				<DashboardWidgets widgetFactory={ widgetFactory } />
			</div>
		</>
	);
};
