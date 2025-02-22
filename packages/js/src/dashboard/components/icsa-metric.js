import { InfoTooltip, infoTooltip } from "./info-tooltip";
import { ArrowNarrowUpIcon, ArrowNarrowDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
/**
 *  Represents one of the ICSA metrics.
 * @param {string} metricName The name of the metric.
 * @param {number} value The value of the metric.
 * @param {number} delta The delta of the metric.
 * @returns {JSX.Element}
 */
export const ICSAMetric = ( { metricName, value, delta } ) => {
	return <div className={ "yst-flex yst-flex-col yst-items-center yst-justify-center yst-w-[300px] yst-h-[145px] yst-gap-2" }>
		<span className="yst-text-2xl yst-font-bold yst-text-slate-900">{ value} </span>
		<span>{ metricName }</span>
		<div className="yst-flex yst-justify-center">
			{ delta > 0 && <ArrowNarrowUpIcon className="yst-w-4 yst-h-4 yst-text-green-600" /> }
			{ delta < 0 && <ArrowNarrowDownIcon className="yst-w-4 yst-h-4 yst-text-red-600" /> }
			<span
				className={ classNames(
					( delta > 0 && "yst-text-green-600" ),
					( delta < 0 && "yst-text-red-600" ),
					"yst-text-sm yst-font-semibold",
				) }
			> { delta } </span>
		</div>
	</div>;
};

