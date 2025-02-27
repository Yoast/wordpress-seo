import { InfoTooltip } from "./info-tooltip";
import { ArrowNarrowUpIcon, ArrowNarrowDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { TooltipContent } from "./tooltip-content";

/* eslint-disable complexity */
/**
 *  Represents one of the ICSA metrics.
 * @param {string} metricName The name of the metric.
 * @param {number} value The value of the metric.
 * @param {number} delta The delta of the metric.
 * @param {string} tooltipLocalizedString The content of the tooltip.
 * @param {string} tooltipUrl The learn more link.
 * @param {boolean} hasBorder Whether the metric has a border.
 *
 * @returns {JSX.Element}
 */
export const IcsaMetric = ( { metricName, value, delta, tooltipLocalizedString, tooltipUrl, hasBorder = true } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
		{ hasBorder && <div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200" /> }
		<div className="yst-absolute yst-end-6 yst-top-2">
			<InfoTooltip>
				<TooltipContent
					url={ tooltipUrl }
					localizedString={ tooltipLocalizedString }
				/>
			</InfoTooltip>
		</div>
		<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
			{ value }
		</div>
		<div className="yst-text-center">
			{ metricName }
		</div>
		<div className="yst-text-center yst-mt-2">
			<div className="yst-flex yst-justify-center">
				{ delta > 0 && <ArrowNarrowUpIcon className="yst-w-4 yst-h-4 yst-text-green-600" /> }
				{ delta < 0 && <ArrowNarrowDownIcon className="yst-w-4 yst-h-4 yst-text-red-600" /> }
				<span
					className={ classNames(
						( delta > 0 && "yst-text-green-600" ),
						( delta < 0 && "yst-text-red-600" ),
						"yst-text-sm yst-font-semibold"
					) }
				> { delta } </span>
			</div>
		</div>
	</div>;
};
/* eslint-enable complexity */

