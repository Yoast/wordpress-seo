import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, SkeletonLoader } from "@yoast/ui-library";
import { NoDataParagraph } from "../components/no-data-paragraph";
import { WidgetTable } from "../components/widget-table";
import { useRemoteData } from "../services/use-remote-data";
import { Widget } from "./widget";

/**
 * @type {import("../index").TopQueryData} TopQueryData
 * @type {import("../services/data-provider")} DataProvider
 * @type {import("../services/remote-data-provider")} RemoteDataProvider
 * @type {import("../services/data-formatter")} DataFormatter
 */

/**
 * @param {number} index The index.
 * @returns {JSX.Element} The element.
 */
const TopQueriesSkeletonLoaderRow = ( { index } ) => (
	<WidgetTable.Row index={ index }>
		<WidgetTable.Cell><SkeletonLoader>focus keyphrase</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">10</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">100</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">0.12</SkeletonLoader></WidgetTable.Cell>
		<WidgetTable.Cell><SkeletonLoader className="yst-ms-auto">12.34</SkeletonLoader></WidgetTable.Cell>
	</WidgetTable.Row>
);

/**
 * @param {TopQueryData[]} [data] The data. Either data or children must be provided.
 * @param {JSX.Element} [children] The children. Use this to override the data rendering.
 *
 * @returns {JSX.Element} The element.
 */
const TopQueriesTable = ( { data, children } ) => {
	return <WidgetTable>
		<WidgetTable.Head>
			<WidgetTable.Header>{ __( "Query", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Clicks", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "Impressions", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header className="yst-text-end">{ __( "CTR", "wordpress-seo" ) }</WidgetTable.Header>
			<WidgetTable.Header>
				<div className="yst-flex yst-justify-end">
					<div className="yst-w-min yst-text-end">{ __( "Average position", "wordpress-seo" ) }</div>
				</div>
			</WidgetTable.Header>
		</WidgetTable.Head>
		<WidgetTable.Body>
			{ children || data.map( ( { subject, clicks, impressions, ctr, position }, index ) => (
				<WidgetTable.Row key={ `most-popular-content-${ index }` } index={ index }>
					<WidgetTable.Cell className="yst-text-slate-900 yst-font-medium">{ subject }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ clicks }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ impressions }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ ctr }</WidgetTable.Cell>
					<WidgetTable.Cell className="yst-text-end">{ position }</WidgetTable.Cell>
				</WidgetTable.Row>
			) ) }
		</WidgetTable.Body>
	</WidgetTable>;
};


/**
 * The content for TopQueriesWidget.
 *
 * @param {TopQueryData[]} [data]
 * @param {boolean} [isPending]
 * @param {Error} [error]
 * @param {number} [limit=5]
 *
 * @returns {JSX.Element} The element.
 */
export const TopQueriesWidgetContent = ( { data, isPending, error, limit = 5 } ) => {
	if ( isPending ) {
		return (
			<TopQueriesTable>
				{ Array.from( { length: limit }, ( _, index ) => (
					<TopQueriesSkeletonLoaderRow key={ `top-queries-table--row__${ index }` } index={ index } />
				) ) }
			</TopQueriesTable>
		);
	}
	if ( error ) {
		return <Alert variant="error" className="yst-mt-4">{ error.message }</Alert>;
	}
	if ( data.length === 0 ) {
		return <NoDataParagraph />;
	}

	return <TopQueriesTable data={ data } />;
};

/**
 * @param {DataFormatter} dataFormatter The data formatter.
 * @returns {function(?TopQueryData[]): TopQueryData[]} Function to format the top queries data.
 */
export const createTopQueriesFormatter = ( dataFormatter ) => ( data = [] ) => data.map( ( item ) => ( {
	subject: dataFormatter.format( item.subject, "subject", { widget: "topQueries" } ),
	clicks: dataFormatter.format( item.clicks, "clicks", { widget: "topQueries" } ),
	impressions: dataFormatter.format( item.impressions, "impressions", { widget: "topQueries" } ),
	ctr: dataFormatter.format( item.ctr, "ctr", { widget: "topQueries" } ),
	position: dataFormatter.format( item.position, "position", { widget: "topQueries" } ),
} ) );

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatter} dataFormatter The data formatter.
 * @param {number} [limit=5] The limit.
 * @returns {JSX.Element} The element.
 */
export const TopQueriesWidget = ( { dataProvider, remoteDataProvider, dataFormatter, limit = 5 } ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<TopPageData[]|Error>} The promise of TopPageData or an Error.
	 */
	const getTopQueries = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ limit: limit.toString( 10 ), options: { widget: "query" } },
			options );
	}, [ dataProvider, limit ] );

	const infoLink = dataProvider.getLink( "topQueriesInfoLearnMore" );

	/**
	 * @type {function(?TopQueryData[]): TopQueryData[]} Function to format the top queries data.
	 */
	const formatTopQueries = useMemo( () => createTopQueriesFormatter( dataFormatter ), [ dataFormatter ] );

	const { data, error, isPending } = useRemoteData( getTopQueries, formatTopQueries );

	return <Widget
		className="yst-paper__content yst-col-span-4"
		title={ __( "Top 5 search queries", "wordpress-seo" ) }
		tooltip={ __(
			"The top 5 search queries on your website with the highest number of clicks.",
			"wordpress-seo"
		) }
		tooltipLearnMoreLink={ infoLink }
	>
		<TopQueriesWidgetContent
			data={ data }
			isPending={ isPending }
			limit={ limit }
			error={ error }
		/>
	</Widget>;
};
