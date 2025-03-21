import { Trend } from "../../components/trend";
import { WidgetTooltip, WidgetDataSources } from "../widget";

/**
 * Represents one of the organic sessions compare metrics.
 * @param {string} metricName The name of the metric.
 * @param {object} data The data of the metric.
 * @param {object[]} dataSources The sources of the data in the widget.
 * @param {ReactNode} tooltipLocalizedContent The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetric = ( { metricName, data, dataSources, tooltipLocalizedContent } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-min-w-72">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<WidgetTooltip content={ tooltipLocalizedContent }>
				<WidgetDataSources dataSources={ dataSources } />
			</WidgetTooltip>
		</div>
		<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
			{ data.formattedValue }
		</div>
		<div className="yst-text-center">
			{ metricName }
		</div>
		<div className="yst-text-center yst-mt-2">
			<Trend value={ data.delta } formattedValue={ data.formattedDelta } />
		</div>
	</div>;
};

