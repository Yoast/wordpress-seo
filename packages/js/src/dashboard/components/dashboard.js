import { useCallback, useState } from "@wordpress/element";
import { PageTitle } from "./page-title";

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
 * @param {WidgetType[]} initialWidgets The initial widgets.
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @param {Links} links The links.
 * @param {boolean} sitekitFeatureEnabled Whether the site kit feature is enabled.
 *
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { widgetFactory, initialWidgets = [], userName, features, links, sitekitFeatureEnabled } ) => {
	const [ widgets, setWidgets ] = useState( () => initialWidgets.map( prepareWidgetInstance ) );

	// eslint-disable-next-line no-unused-vars
	const addWidget = useCallback( ( type ) => {
		setWidgets( ( currentWidgets ) => [ ...currentWidgets, prepareWidgetInstance( type ) ] );
	}, [] );

	const removeWidget = useCallback( ( type ) => {
		setWidgets( ( currentWidgets ) => currentWidgets.filter( ( widget ) => widget.type !== type ) );
	}, [] );

	return (
		<>
			<PageTitle userName={ userName } features={ features } links={ links } sitekitFeatureEnabled={ sitekitFeatureEnabled } />
			<div className="yst-grid yst-grid-cols-4 yst-gap-6 yst-my-6">
				{ widgets.map( ( widget ) => widgetFactory.createWidget( widget, removeWidget ) ) }
			</div>
		</>
	);
};
