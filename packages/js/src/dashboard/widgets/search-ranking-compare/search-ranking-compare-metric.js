import { Trend } from "../../components/trend";
import { WidgetTooltip } from "../widget";

/** Represents the divider between the organic sessions compare metrics.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetricDivider = () => {
	return <div className="yst-h-px yst-w-full yst-bg-slate-200 yst-my-6 @7xl:yst-h-20 @7xl:yst-w-px @7xl:yst-my-1" />;
};

/**
 * Represents one of the organic sessions compare metrics.
 * @param {string} metricName The name of the metric.
 * @param {object} data The data of the metric.
 * @param {string} tooltipLocalizedString The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetric = ( { metricName, data, tooltipLocalizedString } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-min-w-72 yst-content-around">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<WidgetTooltip>
				<>{ tooltipLocalizedString }</>
			</WidgetTooltip>
		</div>
		<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
			{ data === null ? "-" : data.formattedValue }
		</div>
		<div className="yst-text-center">
			{ metricName }
		</div>
		<div className="yst-text-center yst-mt-2">
			{ data === null
				? "-"
				: <Trend value={ data.delta } formattedValue={ data.formattedDelta } />
			}
		</div>
	</div>;
};

