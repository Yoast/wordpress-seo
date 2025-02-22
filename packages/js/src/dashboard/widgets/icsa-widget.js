import { useCallback, useMemo, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";
import { ICSAMetric } from "../components/icsa-metric";

/**
 * @type {import("../index").ICSAData} ICSAData
 */

/**
 * @returns {JSX.Element} The element.
 */
const ICSASkeletonLoader = () => {
	return ( <div>
		<SkeletonLoader>https://example.com/page</SkeletonLoader>
		<SkeletonLoader className="yst-ms-auto">10</SkeletonLoader>
		<div className="yst-flex yst-justify-center">
			<SkeletonLoader className="yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full"/>
		</div>
	</div> );
};

/**
 * @param {import("../services/data-formatter")} dataFormatter The data formatter.
 * @returns {function(?ICSAData): ICSAData} Function to format the widget data.
 */
export const createICSADataFormatter = ( dataFormatter ) => ( data = [] ) => data.map( ( item ) => ( {
	subject: dataFormatter.format( item.subject, "subject", { widget: "topPages" } ),
	clicks: dataFormatter.format( item.clicks, "clicks", { widget: "topPages" } ),
	impressions: dataFormatter.format( item.impressions, "impressions", { widget: "topPages" } ),
	ctr: dataFormatter.format( item.ctr, "ctr", { widget: "topPages" } ),
	position: dataFormatter.format( item.position, "position", { widget: "topPages" } ),
	seoScore: dataFormatter.format( item.seoScore, "seoScore", { widget: "topPages" } ),
	links: dataFormatter.format( item.links, "links", { widget: "topPages" } ),
} ) );

/**
 * @param {import("../services/data-provider")} dataProvider The data provider.
 * @param {import("../services/remote-data-provider")} remoteDataProvider The remote data provider.
 * @param {import("../services/data-formatter")} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
export const ICSAWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<ICSAData|Error>} The promise of ICSAData or an Error.
	 */
	const getICSAData = useCallback( ( options ) => {
		/*
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "icsa" }  },
			options );
		 */
		return
	}, [ dataProvider ] );

	/**
	 * @type {function(?ICSAData): ICSAData} Function to format the widget data.
	 */
	//const formatICSAData = useMemo( () => createICSADataFormatter( dataFormatter ), [ dataFormatter ] );

	// const { data, error, isPending } = useRemoteData( getICSAData, formatICSAData );
	const error = false;
	const isPending = false;
	const data = [
		{
			current: {
				impressions: 10,
				clicks: 10,
				ctr: 0.4,
				position: 10,
			},
			previous: {
				sessions: 0,
				clicks: 3,
				ctr: 0.6,
				position: 10,
			},
		},
	];
	return <Widget className="yst-paper__content yst-col-span-4">
		{ isPending && <ICSASkeletonLoader /> }
		{ error && <Alert variant="error" className="yst-mt-4">{ error.message }</Alert> }
		{ data.length === 0 && <p className="yst-mt-4">{ __( "No data to display: CHANGE ME", "wordpress-seo" ) }</p> }
		{ data.length > 0 && <div className="yst-flex yst-justify-between">
			<ICSAMetric metricName="Impressions" value={ data[ 0 ].current.impressions } delta={ data[ 0 ].current.impressions - data[ 0 ].previous.impressions } />
			<ICSAMetric metricName="Clicks" value={ data[ 0 ].current.clicks } delta={ data[ 0 ].current.clicks - data[ 0 ].previous.clicks } />
			<ICSAMetric metricName="CTR" value={ data[ 0 ].current.ctr } delta={ data[ 0 ].current.ctr - data[ 0 ].previous.ctr } />
			<ICSAMetric metricName="Position" value={ data[ 0 ].current.position } delta={ data[ 0 ].current.position - data[ 0 ].previous.position } />
</div>
		 }
	</Widget>;
};
