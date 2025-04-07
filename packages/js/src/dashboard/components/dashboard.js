import { useCallback, useSyncExternalStore } from "@wordpress/element";
import { PageTitle } from "./page-title";
import { values } from "lodash";
import { WidgetFactory } from "../services/widget-factory";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 * @type {import("../index").WidgetType} WidgetType
 * @type {import("../index").WidgetInstance} WidgetInstance
 * @type {import("../services/widget-factory").WidgetFactory} WidgetFactory
 */

/**
 * @param {WidgetType} type The widget type.
 * @returns {WidgetInstance} The widget instance.
 */
const prepareWidgetInstance = ( type ) => {
	return { id: `widget--${ type }__${ Date.now() }`, type };
};

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
				{ values( WidgetFactory.types ).map( ( widget ) => widgetFactory.createWidget( prepareWidgetInstance( widget ) ) ) }
			</div>
		</>
	);
};
