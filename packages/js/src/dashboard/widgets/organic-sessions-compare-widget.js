import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";
import { OrganicSessionsCompareMetric } from "../components/organic-sessions-compare-metric";
import { InfoTooltip } from "../components/info-tooltip";
import { TooltipContent } from "../components/tooltip-content";
import { getDifference } from "../transformers/difference";
/**
 * @type {import("../index").MetricData} MetricData
 * @type {import("../index").OrganicSessionsCompareData} OrganicSessionsCompareData
 */

/**
 * @returns {JSX.Element} The element.
 */
const IcsaSkeletonLoader = () => {
	return (
		<div className="yst-flex yst-justify-between">
			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200" />
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" ) }
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>

			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200" />
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days.", "wordpress-seo" ) }
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>

			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200" />
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "The average click-through-rate for your website over the last 28 days.", "wordpress-seo" ) }
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>

			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>
		</div>
	);
};

/**
 * @param {TimeBasedData[]} data The data.
 * @returns {OrganicSessionsCompareData} The transformed data.
 */
const transformData = ( data ) => {
	if ( Object.keys( data[ 0 ].current ).length === 2 ) {
		return {
			impressions: {
				value: data[0].current.total_impressions || NaN,
				delta: getDifference( data[0]?.current?.total_impressions || NaN, data[0]?.previous?.total_impressions || NaN ),
			},
			clicks: {
				value: data[0].current.total_clicks || NaN,
				delta: getDifference( data[0]?.current?.total_clicks || NaN, data[0].previous.total_clicks || NaN ),
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
 * @param {function} dataTransformer The data transformer.
 * @param {import("../services/icsa-data-formatter")} dataFormatter The data formatter.
 * @returns {function(?TimeBasedData[]): OrganicSessionsCompareData} Function to format the widget data.
 */
export const createIcsaDataFormatter = ( dataTransformer, dataFormatter ) => ( initData ) => {
	const data = dataTransformer( initData );
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
 * @param {import("../services/icsa-data-formatter")} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsCompareWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<TimeBasedData|Error>} The promise of IcsaData or an Error.
	 */
	const getIcsaData = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "searchRankingCompare" }  },
			options );
	}, [ dataProvider ] );

	/**
	 * @type {function(?TimeBasedData[]): IcsaData} Function to format the widget data.
	 * */
	const formatIcsaData = useMemo( () => createIcsaDataFormatter( transformData, dataFormatter ), [ transformData, dataFormatter ] );

	const { data, error, isPending } = useRemoteData( getIcsaData, formatIcsaData );

	return <Widget className="yst-paper__content yst-col-span-4">
		{ isPending && <IcsaSkeletonLoader /> }
		{ error && <Alert variant="error" className="yst-mt-4">{ error.message }</Alert> }
		{ data && Object.keys( data ).length > 0 && <div className="yst-flex yst-justify-between">
			<OrganicSessionsCompareMetric
				metricName="Impressions"
				value={ data.impressions.value }
				delta={ data.impressions.delta }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<OrganicSessionsCompareMetric
				metricName="Clicks"
				value={ data.clicks.value }
				delta={ data.clicks.delta }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<OrganicSessionsCompareMetric
				metricName="CTR"
				value={ Object.keys( data ).length > 2 ? data.ctr.value : null }
				delta={ Object.keys( data ).length > 2 ? data.ctr.delta : null }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The average click-through-rate for your website over the last 28 days.", "wordpress-seo" ) }
			/>
			<OrganicSessionsCompareMetric
				metricName="Position"
				value={ Object.keys( data ).length > 2 ? data.position.value : null }
				delta={ Object.keys( data ).length > 2 ? data.position.delta : null }
				hasBorder={ false }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
			/>
		</div>
		}
	</Widget>;
};
