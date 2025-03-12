import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { SearchRankingCompareMetric, SearchRankingCompareMetricDivider } from "./search-ranking-compare-metric";
import { __ } from "@wordpress/i18n";
import { NoDataParagraph } from "../../components/no-data-paragraph";
import { WidgetTooltip } from "../widget";

/**
 * Represents the skeleton loader for an organic sessions compare metric component.
 * @param {string} tooltipLocalizedString The content of the tooltip.
 *
 * @returns {JSX.Element}
 */
const SearchRankingCompareMetricSkeletonLoader = ( { tooltipLocalizedString } ) => {
	return <div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-72">
		<div className="yst-absolute yst-end-6 yst-top-2">
			<WidgetTooltip>
				<>{ tooltipLocalizedString }</>
			</WidgetTooltip>
		</div>
		<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
		<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2">Dummy</SkeletonLoader>
		<SkeletonLoader className="yst-text-center yst-text-sm yst-mt-2 yst-font-semibold">- 13%</SkeletonLoader>
	</div>;
};

/**
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareSkeletonLoader = () => {
	return (
		<div className="yst-flex yst-flex-col yst-justify-center yst-items-center @6xl:yst-flex-row @6xl:yst-justify-evenly rtl:yst-flex-row-reverse ">
			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedString={ __( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedString={ __( "The average click-through-rate for your website over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
			/>
		</div>
	);
};

/* eslint-disable complexity */
/**
 * The content of the search ranking compare widget.
 * @param {import("./search-ranking-compare-widget").SearchRankingCompareData} data
 * @param {Error} error
 * @param {boolean} isPending
 * @returns {JSX.Element}
 * @constructor
 */
export const SearchRankingCompareWidgetContent = ( { data, error, isPending } ) => {
	if ( isPending ) {
		return <SearchRankingCompareSkeletonLoader />;
	}

	if ( error ) {
		return <Alert variant="error" className="yst-mt-4">{ error.message }</Alert>;
	}

	if ( data.length === 0 ) {
		return <NoDataParagraph />;
	}

	if ( data ) {
		return <div className="yst-flex yst-flex-col yst-justify-center yst-items-center @6xl:yst-flex-row @6xl:yst-justify-evenly rtl:yst-flex-row-reverse ">
			<SearchRankingCompareMetric
				metricName="Impressions"
				data={ data.impressions }
				tooltipLocalizedString={ __( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetric
				metricName="Clicks"
				data={ data.clicks }
				tooltipLocalizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetric
				metricName="CTR"
				data={ data?.ctr ?? null }
				tooltipLocalizedString={ __( "The average click-through-rate for your website over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetric
				metricName="Position"
				data={ data?.position ?? null }
				tooltipLocalizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
			/>
		</div>;
	}
};
/* eslint-enable complexity */
