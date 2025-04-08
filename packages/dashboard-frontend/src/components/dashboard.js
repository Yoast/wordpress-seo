import { values } from "lodash";

/**
 * @type {import("../services/widget-factory").WidgetFactory} WidgetFactory
 */

/**
 * @param {WidgetFactory} widgetFactory The widget factory.
 *
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { widgetFactory } ) => (
	<>
		{ values( widgetFactory.types ).map( ( widgetType ) => widgetFactory.createWidget( widgetType ) ) }
	</>
);
