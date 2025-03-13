import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { SearchRankingCompareMetric } from "./search-ranking-compare-metric";
import { SearchRankingCompareMetricDivider } from "./search-ranking-compare-metric-divider";
import { __ } from "@wordpress/i18n";
import { NoDataParagraph } from "../../components/no-data-paragraph";
import { WidgetTooltip } from "../widget";
import { ErrorAlert } from "../../components/error-alert";

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
				{ tooltipLocalizedString }
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

/**
 * The content of the search ranking compare widget.
 * @param {import("./search-ranking-compare-widget").SearchRankingCompareData} data the data to render.
 * @param {Error} error the error object (if an error occurred).
 * @param {boolean} isPending whether the data is still pending.
 * @param {import("../services/data-provider").DataProvider} dataProvider the data provider.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareWidgetContent = ( { data, error, isPending, dataProvider } ) => {
	if ( isPending ) {
		return <SearchRankingCompareSkeletonLoader />;
	}

	if ( error ) {
		return <ErrorAlert error={ error } supportLink={ dataProvider.getLink( "errorSupport" ) } className="yst-mt-4" />;
	}

	if ( data.length === 0 ) {
		return <NoDataParagraph />;
	}

	if ( data ) {
		return <div className="yst-flex yst-flex-col yst-justify-center yst-items-center @7xl:yst-flex-row @7xl:yst-justify-evenly rtl:yst-flex-row-reverse ">
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
				data={ data.ctr }
				tooltipLocalizedString={ __( "The average click-through-rate for your website over the last 28 days.", "wordpress-seo" ) }
			/>
			<SearchRankingCompareMetricDivider />

			<SearchRankingCompareMetric
				metricName="Position"
				data={ data.position }
				tooltipLocalizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
			/>
		</div>;
	}
};
