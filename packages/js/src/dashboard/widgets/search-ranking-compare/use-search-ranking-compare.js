import { useCallback, useMemo } from "@wordpress/element";
import { useRemoteData } from "../../services/use-remote-data";
import { getDifference } from "../../transformers/difference";

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

	if ( rawData[ 0 ].current.average_ctr ) {
		data.ctr = {
			value: rawData[ 0 ].current.average_ctr,
			delta: getDifference( rawData[ 0 ].current.average_ctr, rawData[ 0 ].previous.average_ctr ),
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
const createDataFormatter = ( dataFormatter ) => ( data ) => {
	if ( data === null ) {
		return null;
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
 * @returns {{data?: FormattedSearchRankingCompareData, error?: Error, isPending: boolean}} The remote data info.
 */
export const useSearchRankingCompare = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<TimeBasedData[]|Error>} The promise of TimeBasedData[] or an Error.
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
	const formatData = useMemo( () => ( rawData ) => createDataFormatter( dataFormatter )( transformData( rawData ) ), [ dataFormatter ] );

	return useRemoteData( getData, formatData );
};
