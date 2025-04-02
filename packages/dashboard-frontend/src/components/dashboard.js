import { values } from "lodash";

/**
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
 *
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { widgetFactory } ) => (
	<>
		{ values( widgetFactory.types ).map( ( widget ) => widgetFactory.createWidget( prepareWidgetInstance( widget ) ) ) }
	</>
);
