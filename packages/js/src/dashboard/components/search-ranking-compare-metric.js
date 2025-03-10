import { Trend } from "./trend";
import { WidgetTooltip } from "../widgets/widget";

/**
 *  Represents one of the organic sessions compare metrics.
 * @param {string} metricName The name of the metric.
 * @param {object} data The data of the metric.
 * @param {object[]} [dataSources] The sources of the data in the widget.
 * @param {string} [tooltipContent] The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetric = ( { metricName, data, dataSources, tooltipContent } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-72 yst-content-around">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<WidgetTooltip dataSources={ dataSources }>{ tooltipContent }</WidgetTooltip>
		</div>
		<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
			{ data === null ? "-" : data.formattedValue }
		</div>
		<div className="yst-text-center">
			{ metricName }
		</div>
		{ data !== null && <div className="yst-text-center yst-mt-2">
			<Trend
				value={ data.delta }
				formattedValue={ data.formattedDelta }
			/>
		</div> }
	</div>;
};

