import { useEffect } from "@wordpress/element";
import { __, _x } from "@wordpress/i18n";
import { ErrorAlert } from "../../components/error-alert";
import { NoDataParagraph } from "../../components/no-data-paragraph";
import { SearchRankingCompareMetric, SearchRankingCompareMetricSkeletonLoader } from "./search-ranking-compare-metric";
import { SearchRankingCompareMetricDivider } from "./search-ranking-compare-metric-divider";
import { useSearchRankingCompare } from "./use-search-ranking-compare";

// Preventing some duplication.
const META = {
	impressions: {
		name: _x( "Impressions", "The number of times your website appeared in the Google search results", "wordpress-seo" ),
		tooltip: __( "The number of times your website appeared in the Google search results over the last 28 days.", "wordpress-seo" ),
		dataSources: [ { source: __( "Site Kit by Google", "wordpress-seo" ) } ],
	},
	clicks: {
		name: _x( "Clicks", "The number of times users clicked on your website's link in the Google search results", "wordpress-seo" ),
		tooltip: __( "The number of times users clicked on your website's link in the Google search results over the last 28 days.", "wordpress-seo" ),
		dataSources: [ { source: __( "Site Kit by Google", "wordpress-seo" ) } ],
	},
	ctr: {
		name: _x( "Average CTR", "Click-through-rate for your website in the Google search results", "wordpress-seo" ),
		tooltip: __( "The average click-through-rate for your website in the Google search results over the last 28 days.", "wordpress-seo" ),
		dataSources: [ { source: __( "Site Kit by Google", "wordpress-seo" ) } ],
	},
	position: {
		name: _x( "Average position", "Average position of your website in the Google search results", "wordpress-seo" ),
		tooltip: __( "The average position of your website in the Google search results over the last 28 days.", "wordpress-seo" ),
		dataSources: [ { source: __( "Site Kit by Google", "wordpress-seo" ) } ],
	},
};

/**
 * @param {ReactNode} children The children.
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareLayout = ( { children } ) => (
	<div className="yst-flex yst-flex-col @3xl:yst-flex-row yst-gap-4 yst-justify-between rtl:yst-flex-row-reverse">
		{ children }
	</div>
);

/**
 * @returns {JSX.Element} The element.
 */
const SearchRankingCompareSkeletonLoader = () => {
	return (
		<SearchRankingCompareLayout>
			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedContent={ META.impressions.tooltip }
				dataSources={ META.impressions.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedContent={ META.clicks.tooltip }
				dataSources={ META.clicks.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedContent={ META.ctr.tooltip }
				dataSources={ META.ctr.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetricSkeletonLoader
				tooltipLocalizedContent={ META.position.tooltip }
				dataSources={ META.position.dataSources }
			/>
		</SearchRankingCompareLayout>
	);
};

/**
 * The content of the search ranking compare widget.
 *
 * @param {import("./search-ranking-compare-widget").SearchRankingCompareData} data the data to render.
 * @param {import("../services/data-provider").DataProvider} dataProvider the data provider.
 * @param {import("../services/remote-data-provider").RemoteDataProvider} remoteDataProvider the remote data provider.
 * @param {function} setShowTitle The function to update the title visibility.
 *
 * @returns {JSX.Element}
 */
export const SearchRankingCompareWidgetContent = ( { dataProvider, remoteDataProvider, dataFormatter, setShowTitle } ) => {
	const { data, error, isPending } = useSearchRankingCompare( { dataProvider, remoteDataProvider, dataFormatter } );

	useEffect( () => {
		// Only show the title when the data is not pending and there is an error or no data.
		setShowTitle( ! isPending && ( error || data === null ) );
	}, [ data, error, isPending, setShowTitle ] );

	if ( isPending ) {
		return <SearchRankingCompareSkeletonLoader />;
	}

	if ( error ) {
		return <ErrorAlert error={ error } supportLink={ dataProvider.getLink( "errorSupport" ) } className="yst-mt-4" />;
	}

	if ( data === null ) {
		return <NoDataParagraph />;
	}

	if ( data ) {
		return <SearchRankingCompareLayout>
			<SearchRankingCompareMetric
				metricName={ META.impressions.name }
				data={ data.impressions }
				tooltipLocalizedContent={ META.impressions.tooltip }
				dataSources={ META.impressions.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetric
				metricName={ META.clicks.name }
				data={ data.clicks }
				tooltipLocalizedContent={ META.clicks.tooltip }
				dataSources={ META.clicks.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetric
				metricName={ META.ctr.name }
				data={ data.ctr }
				tooltipLocalizedContent={ META.ctr.tooltip }
				dataSources={ META.ctr.dataSources }
			/>
			<SearchRankingCompareMetricDivider />
			<SearchRankingCompareMetric
				metricName={ META.position.name }
				data={ data.position }
				tooltipLocalizedContent={ META.position.tooltip }
				dataSources={ META.position.dataSources }
			/>
		</SearchRankingCompareLayout>;
	}
};
