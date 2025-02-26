import { useCallback, useMemo, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";
import { IcsaMetric } from "../components/icsa-metric";
import { InfoTooltip } from "../components/info-tooltip";
import { TooltipContent } from "../components/tooltip-content";
import classNames from "classnames";

/**
 * @type {import("../index").MetricData} MetricData
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
							localizedString={__( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" )}
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>

			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200"/>
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days. ", "wordpress-seo" ) }
						/>
					</InfoTooltip>
				</div>
				<SkeletonLoader className="yst-text-center yst-text-2xl yst-font-bold yst-text-slate-900">12345</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-mt-2">Dummy</SkeletonLoader>
				<SkeletonLoader className="yst-text-center yst-text-sm yst-font-semibold">- 13%</SkeletonLoader>
			</div>

			<div className="yst-flex yst-flex-col yst-relative yst-items-center yst-w-[300px] yst-content-around">
				<div className="yst-absolute yst-right-0 yst-top-1 yst-h-full yst-w-0 yst-border-r yst-border-slate-200"/>
				<div className="yst-absolute yst-end-6 yst-top-2">
					<InfoTooltip>
						<TooltipContent
							url="https://example.com"
							localizedString={ __( "The average click-through-rate for your website over the last 28 days. ", "wordpress-seo" ) }
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
 * @returns {IcsaData} The transformed data.
 */
const transformData = ( data ) => {
	return {
		impressions: {
			value: data[0].current.total_impressions,
			delta: ( data[0].current.total_impressions - data[0].previous.total_impressions ),
		},
		clicks: {
			value: data[0].current.total_clicks,
			delta: ( data[0].current.total_clicks - data[0].previous.total_clicks ),
		},
		ctr: {
			value: data[0].current.average_ctr,
			delta: ( data[0].current.average_ctr - data[0].previous.average_ctr ),
		},
		position: {
			value: data[0].current.average_position,
			delta: ( data[0].current.average_position - data[0].previous.average_position ),
		},
	};
};

/**
 * @param {function} dataTransformer The data transformer.
 * @param {import("../services/icsa-data-formatter")} dataFormatter The data formatter.
 * @returns {function(?TimeBasedData[]): IcsaData} Function to format the widget data.
 */
export const createIcsaDataFormatter = ( dataTransformer, dataFormatter ) => ( initData ) => {
	const data = dataTransformer( initData );
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
export const IcsaWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
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
			<IcsaMetric
				metricName="Impressions"
				value={ data.impressions.value }
				delta={ data.impressions.delta }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The number of times your website appeared in Google search results over the last 28 days.", "wordpress-seo" ) }
			/>
			<IcsaMetric
				metricName="Clicks"
				value={ data.clicks.value }
				delta={ data.clicks.delta }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The total number of times users clicked on your website's link in Google search results over the last 28 days. ", "wordpress-seo" ) }
			/>
			<IcsaMetric
				metricName="CTR"
				value={ data.ctr.value }
				delta={ data.ctr.delta }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "The average click-through-rate for your website over the last 28 days. ", "wordpress-seo" ) }
			/>
			<IcsaMetric
				metricName="Position"
				value={ data.position.value }
				delta={ data.position.delta }
				hasBorder={ false }
				tooltipUrl="https://example.com"
				tooltipLocalizedString={ __( "Average position is the average position of your site in search results over the last 28 days.", "wordpress-seo" ) }
			/>
		</div>
		}
	</Widget>;
};
