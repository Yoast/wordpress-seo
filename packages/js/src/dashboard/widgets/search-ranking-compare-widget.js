import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";
import { SearchRankingCompareMetric, SearchRankingCompareMetricDivider } from "./search-ranking-compare/search-ranking-compare-metric";
import { getDifference } from "../transformers/difference";
import { SearchRankingCompareMetricSkeletonLoader } from "./search-ranking-compare/search-ranking-compare-metric-skeleton-loader";
/**
 * @type {import("../index").MetricData} MetricData
 * @type {import("../index").SearchRankingCompareData} SearchRankingCompareData
 */

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
 * @param {TimeBasedData[]} data The data.
 * @returns {SearchRankingCompareData} The transformed data.
 */
const transformData = ( data ) => {
	if ( Object.keys( data[ 0 ].current ).length === 2 ) {
		return {
			impressions: {
				value: data[ 0 ].current.total_impressions || NaN,
				delta: getDifference( data[ 0 ]?.current?.total_impressions || NaN, data[ 0 ]?.previous?.total_impressions || NaN ),
			},
			clicks: {
				value: data[ 0 ].current.total_clicks || NaN,
				delta: getDifference( data[ 0 ]?.current?.total_clicks || NaN, data[ 0 ].previous.total_clicks || NaN ),
			},
		};
	}

	return {
		impressions: {
			value: data[ 0 ].current.total_impressions || NaN,
			delta: getDifference( data[ 0 ].current.total_impressions || NaN, data[ 0 ].previous.total_impressions || NaN ),
		},
		clicks: {
			value: data[ 0 ].current.total_clicks || NaN,
			delta: getDifference( data[ 0 ].current.total_clicks || NaN, data[ 0 ].previous.total_clicks || NaN ),
		},
		ctr: {
			value: data[ 0 ].current.average_ctr || NaN,
			delta: getDifference( data[ 0 ].current.average_ctr || NaN, data[ 0 ].previous.average_ctr || NaN ),
		},
		position: {
			value: data[ 0 ].current.average_position || NaN,
			delta: getDifference( data[ 0 ].current.average_position || NaN, data[ 0 ].previous.average_position || NaN ),
		},
	};
};

/**
 * @param {import("../services/comparison-metrics-data-formatter")} dataFormatter The data formatter.
 * @returns {function(?TimeBasedData[]): SearchRankingCompareData} Function to format the widget data.
 */
export const createDataFormatter = ( dataFormatter ) => ( data ) => {
	if ( Object.keys( data ).length === 2 ) {
		return {
			impressions: dataFormatter.format( data.impressions, "impressions" ),
			clicks: dataFormatter.format( data.clicks, "clicks" ),
		};
	}
	return {
		impressions: dataFormatter.format( data.impressions, "impressions" ),
		clicks: dataFormatter.format( data.clicks, "clicks" ),
		ctr: dataFormatter.format( data.ctr, "ctr" ),
		position: dataFormatter.format( data.position, "position" ),
	};
};

/**
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @param {import("../services/comparison-metrics-data-formatter")} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
export const SearchRankingCompareWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<TimeBasedData|Error>} The promise of IcsaData or an Error.
	 */
	const getData = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "searchRankingCompare" } },
			options );
	}, [ dataProvider ] );

	/**
	 * @type {function(?TimeBasedData[]): SearchRankingCompareData} Function to format the widget data.
	 * */
	const formatData  = useMemo( () => ( rawData ) => createDataFormatter( dataFormatter )( transformData( rawData ) ), [ dataFormatter ] );
	const { data, error, isPending } = useRemoteData( getData, formatData  );

	return <Widget className="yst-paper__content yst-col-span-4">
		{ isPending && <SearchRankingCompareSkeletonLoader /> }
		{ error && <Alert variant="error" className="yst-mt-4">{ error.message }</Alert> }
		{ data && Object.keys( data ).length > 0 &&
			<div className="yst-flex yst-flex-col yst-justify-center yst-items-center @6xl:yst-flex-row @6xl:yst-justify-evenly rtl:yst-flex-row-reverse ">
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
			</div>
		}
	</Widget>;
};
/* eslint-enable complexity */
