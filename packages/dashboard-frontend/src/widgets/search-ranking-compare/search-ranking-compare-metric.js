import { SkeletonLoader } from "@yoast/ui-library";
import classNames from "classnames";
import { Trend } from "../../components/trend";
import { WidgetDataSources, WidgetTooltip } from "../../components/widget";

/**
 * @param {ReactNode} children The children.
 * @param {string} [className] The class name.
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareMetricLayout = ( { className, children } ) => (
	<div
		className={
			classNames(
				"yst-flex yst-gap-4 yst-justify-center yst-bg-white",
				// Mobile: 4 columns, Large: 2 columns, 3XL: 1 column.
				"yst-col-span-4 @lg:yst-col-span-2 @3xl:yst-col-span-1",
				// Mobile/default: only vertical padding; no top/bottom padding on the first/last elements.
				"yst-ps-0 yst-pe-0 yst-pt-4 yst-pb-4 first:yst-pt-0 last:yst-pb-0",
				// Large: no padding, we need specific padding (due to missing nth-child in Tailwind v3) which is taken care of in the widget content.
				"@lg:yst-ps-0 @lg:yst-pe-0 @lg:yst-pt-0 @lg:yst-pb-0",
				// 3XL: only horizontal padding; no start/end padding on the first/last elements.
				"@3xl:yst-ps-4 @3xl:yst-pe-4 @3xl:yst-pt-0 @3xl:yst-pb-0 @3xl:first:yst-ps-0 @3xl:last:yst-pe-0",
				className
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
 * @param {string} [className] The class name.
 * @param {ReactNode} tooltipLocalizedContent The content of the tooltip.
 * @param {object[]} dataSources The sources of the data in the widget.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetricSkeletonLoader = ( { className, tooltipLocalizedContent, dataSources } ) => {
	return (
		<SearchRankingCompareMetricLayout className={ className }>
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
 * @param {string} [className] The class name.
 * @param {string} metricName The name of the metric.
 * @param {object} data The data of the metric.
 * @param {object[]} dataSources The sources of the data in the widget.
 * @param {ReactNode} tooltipLocalizedContent The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetric = ( { className, metricName, data, dataSources, tooltipLocalizedContent } ) => {
	return (
		<SearchRankingCompareMetricLayout className={ className }>
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
