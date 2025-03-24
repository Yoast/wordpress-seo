import { SkeletonLoader } from "@yoast/ui-library";
import classNames from "classnames";
import { Trend } from "../../components/trend";
import { WidgetDataSources, WidgetTooltip } from "../widget";

/**
 * @param {ReactNode} children The children.
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareMetricLayout = ( { children } ) => (
	<div
		className={
			classNames(
				"yst-flex yst-gap-4 yst-justify-center yst-bg-white",
				// Mobile: 4 columns, Large: 2 columns, 3XL: 1 column.
				"yst-col-span-4 @lg:yst-col-span-2 @3xl:yst-col-span-1",
				// Mobile: only vertical padding, Large: all padding, 3XL: only horizontal padding.
				"yst-ps-0 yst-pe-0 yst-pt-4 yst-pb-4 @lg:yst-ps-4 @lg:yst-pe-4 @3xl:yst-pt-0 @3xl:yst-pb-0",
				// Mobile: no top padding on the first or bottom padding on the last element.
				"first:yst-pt-0 last:yst-pb-0 @lg:first:yst-pt-4 @lg:last:yst-pb-4",
				// Large: no start padding on the first two or end padding on the last two elements.
				"@lg:yst-ps-0 @lg:yst-pe-0",
				// 3XL: no start padding on the first or end padding on the last element.
				"@3xl:first:yst-ps-0 @3xl:last:yst-pe-0"
			)
		}
	>
		{ children }
	</div>
);

/**
 * @param {ReactNode} children The children.
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareMetricValueLayout = ( { children } ) => (
	<div className="yst-flex yst-flex-col yst-items-center yst-min-w-28 @3xl:yst-min-w-0">
		{ children }
	</div>
);

/**
 * Represents the skeleton loader for an organic sessions compare metric component.
 * @param {ReactNode} tooltipLocalizedContent The content of the tooltip.
 * @param {object[]} dataSources The sources of the data in the widget.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetricSkeletonLoader = ( { tooltipLocalizedContent, dataSources } ) => {
	return (
		<SearchRankingCompareMetricLayout>
			<div className="yst-w-5" />
			<SearchRankingCompareMetricValueLayout>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2 yst-font-semibold">- 13%</SkeletonLoader>
			</SearchRankingCompareMetricValueLayout>
			<div className="yst-mt-2">
				<WidgetTooltip content={ tooltipLocalizedContent }>
					<WidgetDataSources dataSources={ dataSources } />
				</WidgetTooltip>
			</div>
		</SearchRankingCompareMetricLayout>
	);
};

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
	return (
		<SearchRankingCompareMetricLayout>
			<div className="yst-w-5" />
			<SearchRankingCompareMetricValueLayout>
				<div className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">
					{ data.formattedValue }
				</div>
				<div className="yst-text-center">
					{ metricName }
				</div>
				<div className="yst-text-center yst-mt-2">
					<Trend value={ data.delta } formattedValue={ data.formattedDelta } />
				</div>
			</SearchRankingCompareMetricValueLayout>
			<div className="yst-mt-2">
				<WidgetTooltip content={ tooltipLocalizedContent }>
					<WidgetDataSources dataSources={ dataSources } />
				</WidgetTooltip>
			</div>
		</SearchRankingCompareMetricLayout>
	);
};
