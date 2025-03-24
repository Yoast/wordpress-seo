import classNames from "classnames";

/**
 * Represents the divider between the organic sessions compare metrics.
 * @param {string} className The class name.
 * @returns {JSX.Element} The element.
 */
export const SearchRankingCompareMetricDivider = ( { className } ) => (
	<div
		className={
			classNames(
				"yst-h-px @lg:yst-h-20 yst-w-full @lg:yst-w-px yst-bg-slate-200",
				className
			)
		}
	/>
);
