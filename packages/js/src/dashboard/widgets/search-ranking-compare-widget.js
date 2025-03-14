import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";
import { getDifference } from "../transformers/difference";
import { SearchRankingCompareWidgetContent } from "./search-ranking-compare/search-ranking-compare-widget-content";
/**
 * @typedef { "current"|"previous" } TimeFrame The time frame for the raw metric data.
 */

/**
 * @typedef {Object} TimeFrameData
 * @property {number} total_clicks The total number of clicks.
 * @property {number} total_impressions The total number of impressions.
 * @property {number} average_ctr The average click-through rate.
 * @property {number} average_position The average position.
 */

/**
 * @typedef {Object<TimeFrame, TimeFrameData>} TimeBasedData The data collected during a specific time frame.
 */

/**
 * @typedef { "impressions"|"clicks"|"ctr"|"position" } SearchRankingCompareMetric The possible metrics.
 */

/**
 * @typedef {Object} MetricData
 * @property {number} value - The value of a metric.
 * @property {number} delta - The delta of a metric (i.e. the average difference between current value and the previousof a metric.
 */

/**
 * @typedef {Object} FormattedMetricData
 * @property {string} formattedValue - The value of the metric, formatted.
 * @property {string} formattedDelta - The delta of the metric, formatted.
 * @property {number} delta - The delta of the metric.
 */

/**
 * @typedef {Object<SearchRankingCompareMetric, MetricData>} SearchRankingCompareData The search ranking compare data.
 * @property {MetricData} impressions - The impressions data.
 * @property {MetricData} clicks - The clicks data.
 * @property {MetricData | null} ctr - The click-through rate data (optional).
 * @property {MetricData | null} position - The average position data (optional).
 */

/**
 * @typedef {Object<SearchRankingCompareMetric, FormattedMetricData>} FormattedSearchRankingCompareData The formatted search ranking compare data.
 * @property {FormattedMetricData} impressions - The formatted impressions data.
 * @property {FormattedMetricData} clicks - The formatted clicks data.
 * @property {FormattedMetricData} ctr - The formatted click-through rate data (optional).
 * @property {FormattedMetricData} position - The formatted average position data (optional).
 */

/**
 * @param {TimeBasedData[]} rawData The raw data coming from the API call.
 * @returns {?SearchRankingCompareData} The transformed data.
 */
const transformData = ( rawData ) => {
	if ( rawData.length === 0 ) {
		return null;
	}

	const data = {
		impressions: {
			value: rawData[ 0 ].current.total_impressions,
			delta: getDifference( rawData[ 0 ].current.total_impressions, rawData[ 0 ].previous.total_impressions ),
		},
		clicks: {
			value: rawData[ 0 ].current.total_clicks,
			delta: getDifference( rawData[ 0 ].current.total_clicks, rawData[ 0 ].previous.total_clicks ),
		},
		ctr: null,
		position: null,
	};

	if (  rawData[ 0 ].current.average_ctr ) {
		data.ctr = {
			value: rawData[0].current.average_ctr,
			delta: getDifference( rawData[0].current.average_ctr, rawData[0].previous.average_ctr),
		};
	}

	if ( rawData[ 0 ].current.average_position ) {
		data.position = {
			value: rawData[ 0 ].current.average_position,
			delta: getDifference( rawData[ 0 ].current.average_position, rawData[ 0 ].previous.average_position ),
		};
	}
	return data;
};

/**
 * @param {import("../services/comparison-metrics-data-formatter")} dataFormatter The data formatter.
 * @returns {function(?SearchRankingCompareData): ?FormattedSearchRankingCompareData} Function to format the widget data.
 */
export const createDataFormatter = ( dataFormatter ) => ( data ) => {
	if ( data === null ) {
		return null;
	}
	return {
		impressions: dataFormatter.format( data.impressions, "impressions" ),
		clicks: dataFormatter.format( data.clicks, "clicks" ),
		ctr: ( "ctr" in data ) ? dataFormatter.format( data.ctr, "ctr" ) : null,
		position: ( "position" in data ) ? dataFormatter.format( data.position, "position" ) : null,
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
	 * @returns {Promise<TimeBasedData[]|Error>} The promise of IcsaData or an Error.
	 */
	const getData = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "searchRankingCompare" } },
			options );
	}, [ dataProvider ] );

	/**
	 * @type {function(?TimeBasedData[]): FormattedSearchRankingCompareData} Function to format the widget data.
	 * */
	const formatData  = useMemo( () => ( rawData ) => createDataFormatter( dataFormatter )( transformData( rawData ) ), [ dataFormatter ] );
	const { data, error, isPending } = useRemoteData( getData, formatData  );

	return <Widget
		className="yst-paper__content yst-col-span-4"
		title={ ( ! isPending && ( error || data === null ) ) && __( "Impressions, Clicks, Site CTR, Average position", "wordpress-seo" ) }
	>
		<SearchRankingCompareWidgetContent
			data={ data }
			error={ error }
			isPending={ isPending }
			dataProvider={ dataProvider }
		/>
	</Widget>;
};
