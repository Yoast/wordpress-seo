import { InfoTooltip } from "./info-tooltip";
import { TooltipContent } from "./tooltip-content";
import { Trend } from "./trend";

/**
 *  Represents one of the organic sessions compare metrics.
 * @param {string} metricName The name of the metric.
 * @param {object} data The data of the metric.
 * @param {string} tooltipLocalizedString The content of the tooltip.
 * @param {string} tooltipUrl The learn more link.
 *
 * @returns {JSX.Element}
 */
export const OrganicSessionsCompareMetric = ( { metricName, data,  tooltipLocalizedString, tooltipUrl } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<InfoTooltip>
				<TooltipContent
					url={ tooltipUrl }
					localizedString={ tooltipLocalizedString }
				/>
			</InfoTooltip>
		</div>
		<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
			{ data.formattedValue === null ? "-" : data.formattedValue }
		</div>
		<div className="yst-text-center">
			{ metricName }
		</div>
		<div className="yst-text-center yst-mt-2">
			<Trend
				value={ data.delta }
				formattedValue={ data.formattedDelta }
			/>
		</div>
	</div>;
};

