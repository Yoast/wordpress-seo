import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SearchRankingCompareWidgetContent } from "./search-ranking-compare/search-ranking-compare-widget-content";
import { Widget } from "./widget";

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
 * Wraps the search ranking compare into a widget.
 * This contains minimal logic, in order to keep the error boundary more likely to catch errors.
 *
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @param {import("../services/comparison-metrics-data-formatter")} dataFormatter The data formatter.
 *
 * @returns {JSX.Element} The element.
 */
export const SearchRankingCompareWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	// Keep track of the title visibility. As it should only show when there is an error or no data (after loading is done).
	// However, we want to have all the fetching logic inside the content for the error boundary.
	// We could just render the with title state here, but that seems more complex than this approach.
	const [ showTitle, setShowTitle ] = useState( false );

	return <Widget
		className="yst-paper__content yst-col-span-4"
		title={ showTitle && __( "Impressions, Clicks, Site CTR, Average position", "wordpress-seo" ) }
		errorSupportLink={ dataProvider.getLink( "errorSupport" ) }
	>
		<SearchRankingCompareWidgetContent
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
			setShowTitle={ setShowTitle }
		/>
	</Widget>;
};
