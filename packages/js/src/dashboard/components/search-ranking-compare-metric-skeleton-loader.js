import { WidgetTooltip } from "../widgets/widget";
import { SkeletonLoader } from "@yoast/ui-library";
/**
 * Represents the skeleton loader for an organic sessions compare metric component.
 * @param {string} tooltipLocalizedString The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareMetricSkeletonLoader = ( { tooltipLocalizedString } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-72">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<WidgetTooltip>
				{ tooltipLocalizedString }
			</WidgetTooltip>
		</div>
		<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
		<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2">Dummy</SkeletonLoader>
		<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2 yst-font-semibold">- 13%</SkeletonLoader>
	</div>;
};

